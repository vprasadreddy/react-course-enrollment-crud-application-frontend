import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

function ScrollToTop() {
  const [isScrollIconVisible, setIsScrollIconVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", toggleScrollIconVisibility);
  }, []);

  const scrollToTop = () => {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    /* window.scrollTo({
      top: 0,
      behavior: "smooth"
    }); */
  };

  const toggleScrollIconVisibility = () => {
    if (window.pageYOffset > 100) {
      setIsScrollIconVisible(true);
    } else {
      setIsScrollIconVisible(false);
    }
  };
  return (
    <>
      {isScrollIconVisible && (
        <FontAwesomeIcon
          icon={faArrowCircleUp}
          className="scroll-to-top-icon"
          onClick={scrollToTop}
          title="Go to top"
        />
      )}
    </>
  );
}

export default ScrollToTop;
