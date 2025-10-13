import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function MarkdownRenderer({content}: {content: string}) {
  return (
    <div className="prose flex flex-col">
      <Markdown rehypePlugins={[rehypeRaw]}>{content}</Markdown>
    </div>
  )
}
