import Markdown from 'react-markdown'

export default function MarkdownRenderer({content}: {content: string}) {
  return (
    <div className="prose flex flex-col">
      <Markdown>{content}</Markdown>
    </div>
  )
}
