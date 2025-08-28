import Markdown from 'react-markdown'

export default function MarkdownRenderer({content}: {content: string}) {
  return (
    <div className="prose">
      <Markdown>{content}</Markdown>
    </div>
  )
}
