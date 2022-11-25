import { Text } from "@chakra-ui/react";
import Linkify from "linkify-react";
import Link from "next/link";

const renderLink = ({ attributes, content }) => {
  console.log(attributes, content);
  const { href, ...props } = attributes;
  if (!href) return content;
  return (
    <Link href={href} target="_blank" {...props}>
      {content}
    </Link>
  );
};

export default function MessageText(props) {
  return (
    <Text {...props}>
      <Linkify options={{ render: renderLink }}>{props.children}</Linkify>
    </Text>
  );
}
