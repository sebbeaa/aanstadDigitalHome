import Split from 'split.js'
import { Editor } from 'grapesjs'

export class CodeEditor {
  private editor: Editor
  private $: any
  private pfx: string
  private opts: any
  private canvas: any
  private panelViews: any
  private isShowing: boolean
  private codePanel: any
  private htmlCodeEditor: any
  private cssCodeEditor: any
  private previousHtmlCode: any
  private previousCssCode: any
  private component: any

  constructor(editor: Editor, opts: any) {
    this.editor = editor
    this.$ = editor.$
    this.pfx = editor.getConfig('stylePrefix')
    this.opts = opts
    this.canvas = this.findWithinEditor(`.${this.pfx}cv-canvas`)
    this.panelViews = opts.appendTo
      ? this.$(opts.appendTo)
      : this.findWithinEditor(`.${this.pfx}pn-${opts.panelId}`)
    this.isShowing = true
  }

  private findPanel() {
    const pn = this.editor.Panels
    const id = this.opts.panelId
    return pn.getPanel(id) || pn.addPanel({ id })
  }

  private findWithinEditor(selector: string) {
    return this.$(selector, this.editor.getEl())
  }

  private buildCodeEditor(type: string) {
    const { editor, opts } = this

    return editor.CodeManager.createViewer({
      codeName: type === 'html' ? 'htmlmixed' : 'css',
      theme: 'hopscotch',
      readOnly: 0,
      autoBeautify: 1,
      autoCloseTags: 1,
      autoCloseBrackets: 1,
      styleActiveLine: 1,
      smartIndent: 1,
      ...opts.codeViewOptions,
    })
  }

  private buildSection(type: string, codeViewer: any) {
    const { $, pfx, opts } = this
    const section = $('<section></section>')
    const btnText = type === 'html' ? opts.htmlBtnText : opts.cssBtnText
    const cleanCssBtn =
      opts.cleanCssBtn && type === 'css'
        ? `<button class="cp-delete-${type} ${pfx}btn-prim">${opts.cleanCssBtnText}</button>`
        : ''
    section.append(
      $(`
            <div class="codepanel-separator">
                <div class="codepanel-label">${type}</div>
                <div class="cp-btn-container">
                    ${cleanCssBtn}
                    <button class="cp-apply-${type} ${pfx}btn-prim">${btnText}</button>
                </div>
            </div>`),
    )
    const codeViewerEl = codeViewer.getElement()
    codeViewerEl.style.height = 'calc(100% - 30px)'
    section.append(codeViewerEl)
    this.codePanel.append(section)
    return section.get(0)
  }

  private buildCodePanel() {
    const { $, editor } = this
    const panel = this.opts.panelId ? this.findPanel() : 0
    this.codePanel = $('<div></div>')
    this.codePanel.addClass('code-panel')

    this.htmlCodeEditor = this.buildCodeEditor('html')
    this.cssCodeEditor = this.buildCodeEditor('css')

    const sections = [
      this.buildSection('html', this.htmlCodeEditor),
      this.buildSection('css', this.cssCodeEditor),
    ]

    panel &&
      !this.opts.appendTo &&
      panel.set('appendContent', this.codePanel).trigger('change:appendContent')
    this.opts.appendTo && $(this.opts.appendTo).append(this.codePanel)
    this.updateEditorContents()

    this.codePanel.find('.cp-apply-html').on('click', this.updateHtml.bind(this))

    this.codePanel.find('.cp-apply-css').on('click', this.updateCss.bind(this))

    this.opts.cleanCssBtn &&
      this.codePanel.find('.cp-delete-css').on('click', this.deleteSelectedCss.bind(this))

    Split(sections, {
      direction: 'vertical',
      sizes: [50, 50],
      minSize: 100,
      gutterSize: 1,
      onDragEnd: this.refreshEditors.bind(this),
    })

    editor.on('component:update', (model) => this.updateEditorContents())
    editor.on('stop:preview', () => {
      if (this.isShowing && !this.opts.preserveWidth) {
        this.canvas.css('width', this.opts.openState.cv)
      }
    })
  }

  public showCodePanel() {
    this.isShowing = true
    this.updateEditorContents()
    this.codePanel.css('display', 'block')
    // make sure editor is aware of width change after the 300ms effect ends
    setTimeout(this.refreshEditors.bind(this), 320)

    if (this.opts.preserveWidth) return

    this.panelViews.css('width', this.opts.openState.pn)
    this.canvas.css('width', this.opts.openState.cv)
  }

  public hideCodePanel() {
    if (this.codePanel) this.codePanel.css('display', 'none')
    this.isShowing = false

    if (this.opts.preserveWidth) return

    this.panelViews.css('width', this.opts.closedState.pn)
    this.canvas.css('width', this.opts.closedState.cv)
  }

  private refreshEditors() {
    this.htmlCodeEditor.refresh()
    this.cssCodeEditor.refresh()
  }

  private updateHtml(e?: Event) {
    e?.preventDefault()
    const { editor, component } = this
    let htmlCode = this.htmlCodeEditor.getContent().trim()
    if (!htmlCode || htmlCode === this.previousHtmlCode) return
    this.previousHtmlCode = htmlCode

    let idStyles = ''
    this.cssCodeEditor
      .getContent()
      .split('}\n')
      .filter((el: string) => Boolean(el.trim()))
      .map((cssObjectRule: string) => {
        if (!/}$/.test(cssObjectRule)) {
          //* Have to check closing bracket existence for every rule cause it can be missed after split and add it if it doesnt match
          return `${cssObjectRule}}`
        }
      })
      .forEach((rule: any) => {
        if (/^#/.test(rule)) idStyles += rule
      })

    htmlCode += `<style>${idStyles}</style>`

    if (component.attributes.type === 'wrapper') {
      editor.setComponents(htmlCode)
    } else {
      editor.select(component.replaceWith(htmlCode))
    }
  }

  private updateCss(e?: Event) {
    e?.preventDefault()
    const cssCode = this.cssCodeEditor.getContent().trim()
    if (!cssCode || cssCode === this.previousCssCode) return
    this.previousCssCode = cssCode
    this.editor.Css.addRules(cssCode)
  }

  private deleteSelectedCss(e?: Event) {
    e?.preventDefault()
    const selections = this.cssCodeEditor.editor.getSelections()
    selections.forEach((selection: any) => this.parseRemove(selection))
    this.cssCodeEditor.editor.deleteH()
  }

  private parseRemove(removeCss: string) {
    const { editor }: any = this
    const css = editor?.Css
    editor?.Css && css.remove(this.getRules(editor.Parser.parseCss(removeCss)))
  }

  private getRules(rules: any[], opts: any = {}) {
    const { editor }: any = this
    const sm = editor.Selectors
    return rules.map((rule: any) => {
      const selector = sm.get(rule.selectors)
      const { state, selectorsAdd } = rule
      const { atRuleType, atRuleParams } = opts
      return (
        selector &&
        editor.Css.get(selector, state, atRuleParams, {
          selectorsAdd,
          atRule: atRuleType,
        })
      )
    })
  }

  private updateEditorContents() {
    if (!this.isShowing) return

    this.component = this.editor.getSelected()
    if (this.component) {
      this.htmlCodeEditor.setContent(this.getComponentHtml(this.component))
      this.cssCodeEditor.setContent(
        this.editor.CodeManager.getCode(this.component, 'css', {
          cssc: this.editor.Css,
        }),
      )
    }
  }

  private getComponentHtml(component: any) {
    const { pfx, opts } = this
    let result = ''
    const componentEl = component.getEl()

    !opts.clearData && componentEl.classList.remove(`${pfx}selected`)
    const html = opts.clearData
      ? component.toHTML()
      : component.attributes.type === 'wrapper'
        ? componentEl.innerHTML
        : componentEl.outerHTML
    !opts.clearData && componentEl.classList.add(`${pfx}selected`)
    result += html

    const js = opts.editJs ? component.getScriptString() : ''
    result += js ? `<script>${js}</script>` : ''

    return result
  }
}
