import React, { useState, useEffect } from "react";
import { getPublicContent } from "../../services/user.service";
import BodyHomePage from "./Body";

const Home: React.FC = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div>
      <BodyHomePage />
    </div>
  );
};

export default Home;
