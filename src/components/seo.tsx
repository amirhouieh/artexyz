import * as React from "react";
import {Head} from "react-static";
import {join} from "path";
import {Img, SiteData} from "../../data-module/types";


export interface SEO {
    thumb?: Img;
    title?: string;
    description?: string;
}

interface IProps {
    sitedata: SiteData;
    pathname: string;
    seo?: SEO;
}


const baseUrl = `https://artexyz.info`;

export const Seo: React.SFC<IProps> = ({seo, pathname = "", sitedata}) => {
    const url = join(baseUrl, pathname);

    const title = seo && seo.title ? seo.title : sitedata.title;
    const description = seo && seo.description ? seo.description : sitedata.description;
    const image = seo && seo.thumb ? seo.thumb : sitedata.thumb;
    const imgUrl = `${baseUrl}/images/${image.filename}`;

    console.log(seo, imgUrl);

    return (
        <Head>

            <link rel="icon"
                  type="image/png"
                  href={`${baseUrl}/images/${sitedata.thumb.filename}`}/>

            <meta name={`keywords`} content={sitedata.tags}/>
            <meta name={`description`} content={`${description}`} />

            <meta name={`copyright`} content={`amir houieh`}/>
            <meta name={`language`} content={`EN`}/>
            <meta name={`Classification`} content={`art`}/>
            <meta name={`author`} content={`amir houieh, amir.houieh@gmail.com`}/>
            <meta name={`designer`} content={`amir houieh`}/>
            <meta name={`owner`} content={`amir houieh`}/>
            <meta name={`url`} content={url}/>
            <meta name={`identifier-URL`} content={url}/>

            <meta property={`og:title`} content={title}/>
            <meta property={`og:url`} content={url}/>
            <meta property={`og:image`} content={imgUrl}/>
            <meta property={`og:image:type`} content={`image/jpg`}/>
            <meta property={`og:image:width`} content={`${image.width}`}/>
            <meta property={`og:image:height`} content={`${image.height}`}/>
            <meta property={`og:site_name`} content={title}/>
            <meta property={`og:description`} content={`${description}`} />
            <meta property={`og:type`} content={"website"} />

            <title>{title}</title>

            <script type="application/ld+json">{`
              {
                "@context": "http://schema.org",
                "@type": "Organization",
                "url": "https://artexyz.info",
                "name": "Rexperimental framework (artexyz)",
                "logo": "https://artexyz.info/${`images/${sitedata.thumb.filename}`}",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+31 627251222",
                },
                  "sameAs": []
              }
            `}</script>

        </Head>
    )
};
