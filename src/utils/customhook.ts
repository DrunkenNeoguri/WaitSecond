import { useEffect, useState } from "react";

export const useTitle = (text: string) => {
  useEffect(() => {
    const htmlTitle = document.querySelector("title")!;
    htmlTitle.innerHTML = text;

    return () => {
      htmlTitle.innerHTML = "맛집을 기다릴 땐, 웨잇세컨드!";
    };
  }, [text]);
};

export const useMetaTag = (prop: {
  title: string;
  description?: string;
  imageUrl?: string;
}) => {
  const [metaTag, setMetaTag] = useState(prop);

  useEffect(() => {
    const metaTitle = document.querySelector('meta[property="og:title"]')!;
    const metaDesc = document.querySelector('meta[property="og:image"]')!;
    const metaImage = document.querySelector(
      'meta[property="og:description"]'
    )!;
    metaTitle.setAttribute("content", prop.title);
    metaDesc.setAttribute(
      "content",
      prop.description === undefined
        ? "손쉽게 매장 대기를 관리하는 내 안의 작은 관리자, 웨잇세컨드"
        : prop.description
    );
    metaImage.setAttribute(
      "content",
      prop.imageUrl === undefined ? "%PUBLIC_URL%/logo.jpg" : prop.imageUrl
    );
  }, [metaTag]);

  return setMetaTag;
};
