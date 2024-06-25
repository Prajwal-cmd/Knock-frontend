import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/Features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  // message and current user
  const { sender, content, attachment = [], createdAt } = message;
  const sameSender = sender?._id === user?._id; // if sending message  myself
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}

      {/* Attachment  */}
      {attachment.length > 0 &&
        attachment.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (<Box key={index}>
            <a href={url} target="_blank" download style={{
                color:"black"
            }}>
        
        <RenderAttachment file={file} url={url} />            </a>
          </Box>);
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {" "}
        {timeAgo}
      </Typography>
    </div>
  );
};

export default memo(MessageComponent);
