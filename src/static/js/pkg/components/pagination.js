export {Pagination}

class Pagination {
  /**
   * @param {Array} data
   * @param {Number} step Before and after current
   * @param {Number} selectedPage Selected page
   */
  constructor(data, step = 1, selectedPage = 1) {
    this.data = data || []
    this.size = this.data.length // Pages size
    this.page = selectedPage
    this.step = step
  }

  Build(targetElem) {
    const htmlFrag = document.createRange().createContextualFragment(`
<a>&#9668;</a>
<span></span>
<a>&#9658;</a>
`)// &#9668; ◄ previous button  |  &#9658; ► next button

    const frag = htmlFrag.querySelector(`span`)

    // Calculate the startPage and endPage.
    let startPage = this.page - this.step
    let endPage = this.page + this.step

    if (startPage <= 0) {
      endPage += -startPage + 1
      startPage = 1
    }

    if (endPage >= this.size) {
      startPage = Math.max(startPage - (endPage - this.size), 1)
      endPage = this.size
    }

    // first
    if (startPage > 1) {
      frag.appendChild(document.createRange().createContextualFragment(
        `<a ${this.page === 1 ? 'class="current-page"' : ''}>1</a><i>...</i>`)
      )
    }

    // middle
    for (let page = startPage; page <= endPage; ++page) {
      frag.appendChild(document.createRange().createContextualFragment(
        `<a ${this.page === page ? 'class="current-page"' : ''}>${page}</a>`
      ))
    }

    // last
    if (endPage < this.size) {
      frag.appendChild(document.createRange().createContextualFragment(
        `<i>...</i><a ${this.page === this.size ? 'class="current-page"' : ''}>${this.size}</a>`
      ))
    }

    // middle "a" click
    htmlFrag.querySelectorAll(`span a`).forEach(aElem => {
      aElem.addEventListener('click', () => {
        this.page = +aElem.innerText
        this.Build(targetElem)
      })
    })

    // Prev and next click
    const [aPrev, ...others] = htmlFrag.querySelectorAll(`a`)
    aPrev.addEventListener(`click`, () => {
      this.page--
      if (this.page < 1) {
        this.page = 1
      }
      this.Build(targetElem)
    })

    // next
    others.at(-1).addEventListener(`click`, () => {
      ++this.page
      if (this.page > this.size) {
        this.page = this.size
      }
      this.Build(targetElem)
    })

    targetElem.innerHTML = "" // clear
    targetElem.append(htmlFrag)
  }
}
