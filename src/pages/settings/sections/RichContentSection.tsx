import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Type, type LucideIcon } from 'lucide-react'
import { PrimaryButton } from '@/components/common'
import { useToast } from '@/context/ToastContext'
import { colors } from '@/utils/colors'

interface RichContentSectionProps {
  title: string
  description: string
  initialContent: string
}

const RichContentSection = ({ title, description, initialContent }: RichContentSectionProps) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [_, setTick] = useState(0)
  const { showToast } = useToast()

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialContent) {
      editorRef.current.innerHTML = initialContent
    }
  }, [initialContent])

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    setTick((t) => t + 1)
  }

  const handleLink = () => {
    const url = prompt('Enter URL')
    if (url) exec('createLink', url)
  }

  const handleSave = () => {
    showToast(`${title} saved successfully`, 'success')
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-line-light">
        <h3 className="text-[18px] font-bold text-ink-primary m-0">{title}</h3>
        <p className="text-[13px] text-ink-secondary mt-1 mb-0">{description}</p>
      </div>

      <div className="border border-line rounded-[14px] overflow-hidden bg-surface">
        <div className="flex items-center gap-0.5 p-2 border-b border-line-light bg-surface-subtle flex-wrap">
          <select onChange={(e) => exec('formatBlock', e.target.value)} defaultValue=""
            className="h-8 px-[10px] rounded-lg border border-line bg-surface text-ink-primary text-[13px] cursor-pointer outline-none">
            <option value="" disabled>Format</option>
            <option value="p">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
          <Divider />
          <ToolbarButton Icon={Bold} onClick={() => exec('bold')} title="Bold" />
          <ToolbarButton Icon={Italic} onClick={() => exec('italic')} title="Italic" />
          <ToolbarButton Icon={Underline} onClick={() => exec('underline')} title="Underline" />
          <Divider />
          <ToolbarButton Icon={List} onClick={() => exec('insertUnorderedList')} title="Bullet list" />
          <ToolbarButton Icon={ListOrdered} onClick={() => exec('insertOrderedList')} title="Numbered list" />
          <Divider />
          <ToolbarButton Icon={LinkIcon} onClick={handleLink} title="Add link" />
          <ToolbarButton Icon={Type} onClick={() => exec('removeFormat')} title="Clear formatting" />
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[320px] py-5 px-6 text-sm text-ink-primary leading-[1.7] outline-none"
        />
      </div>

      <div className="flex justify-end mt-5 pt-4 border-t border-line-light">
        <PrimaryButton label="Save Changes" onClick={handleSave} />
      </div>

      <style>{`
        [contenteditable] h2 { font-size: 20px; font-weight: 700; margin: 16px 0 8px; color: ${colors.textPrimary}; }
        [contenteditable] h3 { font-size: 17px; font-weight: 700; margin: 14px 0 6px; color: ${colors.textPrimary}; }
        [contenteditable] h4 { font-size: 15px; font-weight: 600; margin: 12px 0 6px; color: ${colors.textPrimary}; }
        [contenteditable] p { margin: 8px 0; }
        [contenteditable] ul, [contenteditable] ol { margin: 10px 0; padding-left: 28px; }
        [contenteditable] li { margin: 4px 0; }
        [contenteditable] a { color: ${colors.primary}; text-decoration: underline; }
      `}</style>
    </div>
  )
}

const ToolbarButton = ({ Icon, onClick, title }: { Icon: LucideIcon; onClick: () => void; title: string }) => (
  <button onMouseDown={(e) => { e.preventDefault(); onClick() }} title={title}
    className="w-8 h-8 rounded-lg border-none bg-transparent text-ink-secondary cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-surface-input hover:text-ink-primary">
    <Icon size={15} />
  </button>
)

const Divider = () => (
  <div className="w-px h-5 bg-line-light mx-0.5" />
)

export default RichContentSection
