import React, { useEffect } from "react";
import { useTag } from "@/context/tag";

export default function TagsList() {
  // Context
  const { tags, fetchTags, setUpdatingTag } = useTag();

  useEffect(() => {
    // Fetch tags when the component mounts
    fetchTags();
  }, []);

  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          {tags.map((tag) => (
            <button
              key={tag.id} // Add a unique key to each button
              className="btn"
              onClick={() => {
                setUpdatingTag(tag);
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
