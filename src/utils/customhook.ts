import { useEffect, useState } from "react";

export const useTitle = (text: string) => {
  // useState를 통해 탭 이름을 적용할 값인 title과 이를 세팅해줄 setTitle를 생성
  const [title, setTitle] = useState(text);

  useEffect(() => {
    // 문서의 title Selector를 가져옴
    const htmlTitle = document.querySelector("title")!;
    // useState의 title 값을 innerHTML을 통해 HTML 문서에 적용
    htmlTitle.innerHTML = title;
  }, [title]);
  // 위의 useEffect는 title 값이 바뀔때마다 적용된다.

  // setTitle을 외부로 보내줌으로서, useTitle을 쓸 때마다 해당 값을 받아와 title이 갱신되도록 함.
  return setTitle;
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
