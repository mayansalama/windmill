import React from "react";
import styled from "styled-components";
import { LazyLog, ScrollFollow } from "react-lazylog";

export function Lazylog() {
  return (
    // <ScrollFollow
    //   startFollowing={true}
    //   render={({ follow, onScroll }) => (
    //     <LazyLog url="log.txt" stream follow={follow} onScroll={onScroll} />
    //   )}
    // />

    <Log>
      <object data="log.txt">Not supported</object>
    </Log>
  );
}

const Log = styled.div`
  font-color: white;
`;
