import React from "react";
import path from "path"
import { readFileSync } from "fs"

// Paths Aliases defined through tsconfig.json
const typescriptWebpackPaths = require('./webpack.config.js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DATABASE_PATH = "public/data.min.json";

const readDatabase = () => JSON.parse(readFileSync(DATABASE_PATH).toString('utf8'))

export default {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  getSiteData: async () => {
      const db = await readDatabase(DATABASE_PATH);
      return {
        sitedata: db.sitedata,
        menudata: db.projects.map( (project) => ({
            slug: project.slug,
            title: project.title,
            people: project.people,
            thumb: project.thumb
        }))
      }
  },
  getRoutes: async () => {
    const db = await readDatabase(DATABASE_PATH);
    return [
      {
        path: '/',
        component: 'src/containers/home',
        getData: () => ({data: db}),
        children: db.projects.map((project) => ({
          path: `/${project.slug}`,
          component: 'src/containers/project',
          getData: () => ({data: project, sitedata: db.sitedata})
        }))
      },
      {
        is404: true,
        component: 'src/containers/projects',
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },

  Document: class CustomHtml extends React.Component {
    render() {
      const {
        Html, Head, Body, children, renderMeta,
      } = this.props;

      return (
        <Html lang={"en"}>
        <Head>
          <meta charSet="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          {renderMeta.styleTags}
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-128433230-1" />
          <script dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-128433230-1');`
          }}/>
        </Head>
        <Body>
        <svg className="defs-only">
          <filter id="monochrome" colorInterpolationFilters="sRGB" x="0" y="0" height="100%"
                  width="100%">
            <feColorMatrix type="matrix" values="0.33		0.33 	0.33	0		0
					0.33		0.33 	0.33	0		0
					0			0		0		0		1
					0			0		0		1		0"/>
          </filter>
        </svg>
          {children}
        </Body>
        </Html>
      )
    }
  },

  webpack: (config, { defaultLoaders }) => {
    // Add .ts and .tsx extension to resolver
    config.resolve.extensions.push('.ts', '.tsx')

    // Add TypeScript Path Mappings (from tsconfig via webpack.config.js)
    // to react-statics alias resolution
    config.resolve.alias = typescriptWebpackPaths.resolve.alias

    // We replace the existing JS rule with one, that allows us to use
    // both TypeScript and JavaScript interchangeably
    config.module.rules = [
      {
        oneOf: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: defaultLoaders.jsLoader.exclude, // as std jsLoader exclude
            use: [
              {
                loader: 'babel-loader',
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly: true,
                },
              },
            ],
          },
          // defaultLoaders.cssLoader,
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: "css-loader"
            })
          },
          defaultLoaders.fileLoader,
        ],
      },
    ]

    config.plugins = [ ...config.plugins, new ExtractTextPlugin("styles.css") ]

    return config
  },
}
