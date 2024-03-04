;(function(d, w) {
  w.vantage = w.vantage || {}

  if (w.vantage.uac_modal) {
    return
  }

  w.vantage.uac_modal = (function() {
    var _delim = function(url) {
        return url.indexOf('?') > 0 ? '&' : '?'
      },
      _getMeta = function(name) {
        var meta = document.querySelector(
          'meta[name$="' + name + '"], meta[property$="' + name + '"]'
        )
        return meta && meta.getAttribute('content')
      },
      _create = function(tag, styles) {
        var el = d.createElement(tag)
        for (var s in styles) {
          el.style.setProperty(s, styles[s], 'important')
        }
        return el
      },
      _param = function(obj, delim, sep) {
        return (
          (delim || '?') +
          Object.keys(obj)
            .map(function(i) {
              return [i, obj[i] && encodeURIComponent(obj[i])].join('=')
            })
            .join(sep || '&')
        ).trim()
      },
      _popup = function(url, name, width, height) {
        var top = w.top.outerHeight / 2 + w.top.screenY - height / 2,
          left = w.top.outerWidth / 2 + w.top.screenX - width / 2,
          opts = {
            width: width,
            height: height,
            top: top,
            left: left
          }

        return window.open(url, name, _param(opts, ' ', ','))
      },
      _title = function(txt) {
        var el = els.header.querySelector('#vantage-uac_modal-title') || {}
        el.innerText = txt
      },
      _closeModal = function(e) {
        if (w.vantage.uac_modal) {
          els.body.removeChild(els.modal)
          w.removeEventListener('message', handleMessages, false)
          delete w.vantage.uac_modal
        }
      }

    var env = {
      origin: 'https://pwc-cts-dev-0-lux.tribridge-amplifyhr.eu',
      cdn: 'https://themes.hcm-xhub.com/pwc/pwc-vantage/dev/',
      path: '/my-learning/add'
    }

    var styles = {
      modal: {
        'background-color': '#fff',
        border: '1px solid #f7f7f7',
        'border-radius': '5px',
        'box-shadow': '0 0 20px rgba(64, 64, 65, 0.4)',
        padding: '20px',
        position: 'fixed',
        right: '20px',
        top: '20px',
        width: 'auto',
        'z-index': Math.pow(2, 31) - 1
      },
      logo: {
        display: 'inline-block',
        height: '30px',
        width: '125px',
        'vertical-align': 'middle'
      },
      closeBtn: {
        color: 'black',
        display: 'inline-block',
        height: '24px',
        cursor: 'pointer',
        position: 'absolute',
        right: '22px',
        top: '22px',
        width: '24px'
      },
      spinner: {
        display: 'inline-block',
        height: '30px',
        width: '30px'
      },
      check: {
        display: 'inline-block',
        height: '88px',
        width: '92px'
      },
      iframe: {
        border: 'none',
        'max-height': '820px',
        width: '480px',
        height: 'calc(100vh - 120px)'
      },
      content: {
        padding: '0',
        'text-align': 'center',
        width: '400px'
      },
      refreshBtn: {
        'background-color': '#d93954',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        display: 'inline-block',
        'font-family': 'Georgia',
        'font-size': '18px',
        'font-weight': '700',
        margin: '10px',
        padding: '20px',
        'text-decoration': 'none'
      },
      p: {
        color: '#404041',
        'font-size': '14px',
        'font-family': 'Arial, Calibri, Helvetica, sans-serif',
        'font-weight': '700',
        'line-height': '1.2',
        margin: '10px'
      }
    }

    var els = (function() {
      var _refresh = function(e) {
        var href = env.origin + env.path

        sessionWindow = _popup(href, 'vantage_refresh', 480, 512)

        els.modal.removeChild(els.refresh1)
        els.modal.appendChild(els.refresh2)
        w.setTimeout(function() {
          els.refresh2.appendChild(els.timeout)
        }, 20 * 1000)
      }

      return {
        body: d.body,
        sessionWindow: {},
        modal: _create('div', styles.modal),
        header: (function() {
          var el = _create('div'),
            logo = _create('img', styles.logo),
            closeBtn = _create('img', styles.closeBtn),
            title = _create('span', styles.p)
          logo.src = env.cdn + 'logo.svg'
          closeBtn.src = env.cdn + 'btn-close.svg'
          closeBtn.addEventListener('click', _closeModal, false)
          el.appendChild(logo)
          el.appendChild(title)
          el.appendChild(closeBtn)
          title.id = 'vantage-uac_modal-title'
          return el
        })(),
        loading: (function() {
          var el = _create('div', styles.content)
          spinner = _create('img', styles.spinner)
          spinner.src = env.cdn + 'spinner.gif'
          el.appendChild(spinner)
          return el
        })(),
        iframe: (function() {
          var el = _create('iframe', styles.iframe)
          el.src = env.origin + env.path
          return el
        })(),
        saved: (function() {
          var el = _create('div', styles.content)
          check = _create('img', styles.check)
          check.src = env.cdn + 'check.gif'
          el.appendChild(check)
          return el
        })(),
        refresh1: (function() {
          var el = _create('div', styles.content),
            p1 = _create('p', styles.p),
            p2 = _create('p', styles.p),
            refreshBtn = _create('button', styles.refreshBtn)

          p1.innerText = 'To add learning, you must be logged in.'
          p2.innerText =
            'Use the button below to perform a background login. This will not navigate you away from the page you’re looking at.'
          refreshBtn.innerText = 'Log in'
          refreshBtn.addEventListener('click', _refresh, false)
          el.appendChild(p1)
          el.appendChild(p2)
          el.appendChild(refreshBtn)
          return el
        })(),
        refresh2: (function() {
          var el = _create('div', styles.content),
            p1 = _create('p', styles.p),
            spinner = _create('img', styles.spinner)

          p1.innerText = 'Logging you in, please wait...'
          spinner.src = env.cdn + 'spinner.gif'
          el.appendChild(p1)
          el.appendChild(spinner)
          return el
        })(),
        timeout: (function() {
          var el = _create('p', styles.p)
          el.innerText =
            'Taking too long? You may need to check the Vantage window in case you need to provide your login details.'
          return el
        })()
      }
    })()

    var msg = 'vantage-yourlearning',
      uacData = {
        title: d.title,
        url: w.location.href,
        description: _getMeta('description'),
        provider: _getMeta('site_name') || w.location.hostname
      },
      sessionWindow = {},
      handleMessages = function(e) {
        if (e.origin !== env.origin) {
          return
        }
        //console.log('message:', e);
        if (e.data === msg) {
          uacData.message = msg
          els.modal.removeChild(els.loading)
          els.iframe.contentWindow.postMessage(
            JSON.stringify(uacData),
            env.origin
          )
          els.iframe.style.display = ''
          _title('Add learning')
        }
        if (e.data === msg + '-canceled') {
          //console.log('canceled');
          _closeModal()
        }
        if (e.data === msg + '-saved') {
          //console.log('saved');
          els.modal.appendChild(els.saved)
          els.iframe.style.display = 'none'
          w.setTimeout(function() {
            _closeModal()
          }, 2 * 1000)
        }
        if (e.data === msg + '-loggedin') {
          //console.log('logged in now');
          sessionWindow.close()
          els.modal.removeChild(els.refresh2)
          els.modal.appendChild(els.loading)
          els.modal.appendChild(els.iframe)
        }
        if (e.data === 'vantage-login-error') {
          //console.log('login error');
          els.modal.removeChild(els.loading)
          els.modal.removeChild(els.iframe)
          els.modal.appendChild(els.refresh1)
          _title('')
        }
      }

    if(env.origin.indexOf(window.location.hostname) > 0)
      return null;

    w.addEventListener('message', handleMessages, false)

    els.body.appendChild(els.modal)
    els.modal.appendChild(els.header)
    els.modal.appendChild(els.loading)
    els.modal.appendChild(els.iframe)
    els.iframe.style.display = 'none'

    return els.modal
  })()
})(document, window)
