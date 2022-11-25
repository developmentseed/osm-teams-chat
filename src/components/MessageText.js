import { Text } from "@chakra-ui/react";
import Linkify from "linkify-react";
import Link from "next/link";

const renderLink = ({ attributes, content }) => {
  const { href, ...props } = attributes;
  if (!href) return content;
  return (
    <Link href={href} target="_blank" {...props}>
      {content}
    </Link>
  );
};

export default function MessageText(props) {
  const lines = props.children.split("\n").map((line, index) => {
    return (
      <Text key={index} {...props}>
        <Linkify options={{ render: renderLink }}>{line}</Linkify>
      </Text>
    );
  });
  return lines;
}
