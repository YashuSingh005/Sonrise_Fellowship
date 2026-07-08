(function () {
  'use strict';

  const ADMIN_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  const GITHUB_OWNER = 'YashuSingh005';
  const GITHUB_REPO = 'Sonrise_Fellowship';
  const GITHUB_BRANCH = 'main';
  const SITE_DATA_PATH = 'docs/data/pages.json';

  let currentPage = null;
  let siteData = null;
  let originalData = null;

  function getToken() { return sessionStorage.getItem('gh_token'); }
  function setToken(t) { sessionStorage.setItem('gh_token', t); }

  function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.style.display = 'none'; });
    var el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }

  function showToast(msg, type) {
    type = type || 'info';
    var t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 4000);
  }

  function loading(show) {
    document.getElementById('loading-indicator').style.display = show ? 'block' : 'none';
  }

  // ========== HASH PASSWORD ==========
  async function hashPassword(pw) {
    var enc = new TextEncoder().encode(pw);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  // ========== GITHUB API ==========
  async function githubApi(method, path, body) {
    var token = getToken();
    if (!token) throw new Error('No GitHub token');
    var opts = {
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    var url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + path.replace(/^\//, '');
    var res = await fetch(url, opts);
    var data = await res.json();
    if (!res.ok && !(method === 'GET' && res.status === 404)) {
      throw new Error(data.message || 'GitHub API error: ' + res.status);
    }
    return data;
  }

  async function getFileSha(path) {
    try {
      var data = await githubApi('GET', 'contents/' + path + '?ref=' + GITHUB_BRANCH);
      return data.sha;
    } catch (e) { return null; }
  }

  async function commitFile(path, content, message) {
    var sha = await getFileSha(path);
    var body = {
      message: message || 'Update via Admin Panel',
      content: btoa(unescape(encodeURIComponent(content))),
      branch: GITHUB_BRANCH
    };
    if (sha) body.sha = sha;
    return await githubApi('PUT', 'contents/' + path, body);
  }

  async function uploadImage(file) {
    var ext = file.name.split('.').pop();
    var filename = Date.now() + '-' + Math.random().toString(36).substr(2, 6) + '.' + ext;
    var path = 'docs/uploads/' + filename;

    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var base64 = e.target.result.split(',')[1];
        commitFile(path, atob(base64), 'Upload image: ' + filename)
          .then(function () {
            resolve(GITHUB_OWNER + '/' + GITHUB_REPO + '/main/' + path);
          })
          .catch(reject);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ========== LOAD SITE DATA ==========
  async function loadSiteData() {
    try {
      var raw = await fetch('https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + GITHUB_BRANCH + '/' + SITE_DATA_PATH);
      if (!raw.ok) throw new Error('Not found');
      var text = await raw.text();
      siteData = JSON.parse(text);
      originalData = JSON.parse(text);
    } catch (e) {
      siteData = null;
      showToast('Could not load site data from GitHub: ' + e.message, 'error');
    }
  }

  // ========== LOGIN ==========
  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var pw = document.getElementById('password').value;
    var hash = await hashPassword(pw);
    if (hash === ADMIN_PASSWORD_HASH) {
      document.getElementById('login-error').style.display = 'none';
      sessionStorage.setItem('admin_auth', '1');
      initApp();
    } else {
      document.getElementById('login-error').style.display = 'block';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', function () {
    sessionStorage.removeItem('admin_auth');
    sessionStorage.removeItem('gh_token');
    location.reload();
  });

  document.getElementById('settings-btn').addEventListener('click', function () {
    showView('view-settings');
    document.getElementById('token-input').value = getToken() || '';
    document.getElementById('settings-status').textContent = getToken() ? 'Token configured' : 'No token set';
  });

  document.getElementById('save-token').addEventListener('click', function () {
    var token = document.getElementById('token-input').value.trim();
    if (token) {
      setToken(token);
      document.getElementById('settings-status').textContent = 'Token saved for this session';
      document.getElementById('settings-status').style.color = '#2e7d32';
    } else {
      showToast('Please enter a valid token', 'error');
    }
  });

  document.getElementById('back-to-dashboard').addEventListener('click', function () {
    renderDashboard();
  });

  // ========== DASHBOARD ==========
  async function renderDashboard() {
    showView('view-dashboard');
    await loadSiteData();
    var grid = document.getElementById('dashboard-grid');
    if (!siteData) {
      grid.innerHTML = '<div class="loading-text">No data loaded. Check your GitHub token and connection.</div>';
      return;
    }
    var pages = [
      { key: 'home', name: 'Home Page', path: 'index.html' },
      { key: 'food', name: 'Food Distribution', path: 'food/index.html' },
      { key: 'education', name: 'Education Support', path: 'education/education-support.html' },
      { key: 'outreach', name: 'Community Outreach', path: 'community_outreach/index.html' }
    ];
    grid.innerHTML = '';
    pages.forEach(function (p) {
      var card = document.createElement('div');
      card.className = 'dashboard-card';
      card.innerHTML =
        '<h3>' + p.name + '</h3>' +
        '<p>Edit hero text, content sections, images, and gallery</p>' +
        '<div class="card-actions">' +
        '<button class="btn btn-sm" data-page="' + p.key + '">Edit Page</button>' +
        '<a href="../' + p.path + '" target="_blank" class="btn btn-sm btn-outline">View Page</a>' +
        '</div>';
      card.querySelector('[data-page]').addEventListener('click', function () {
        openEditor(p.key, p.name);
      });
      grid.appendChild(card);
    });
  }

  // ========== EDITOR ==========
  function openEditor(pageKey, pageName) {
    currentPage = pageKey;
    showView('view-editor');
    document.getElementById('editor-title').textContent = 'Editing: ' + pageName;
    renderEditor(pageKey);
  }

  function renderEditor(pageKey) {
    var container = document.getElementById('editor-content');
    var data = siteData[pageKey];
    if (!data) {
      container.innerHTML = '<div class="loading-text">No data for this page.</div>';
      return;
    }
    var html = '';

    // Hero Slides
    if (data.heroSlides) {
      html += '<div class="editor-section"><h3>Hero Slides (Headings)</h3>';
      data.heroSlides.forEach(function (slide, i) {
        html += '<div class="form-group"><label>Slide ' + (i + 1) + '</label>' +
          '<input type="text" class="field" data-key="heroSlides.' + i + '" value="' + escAttr(slide) + '"></div>';
      });
      html += '</div>';
    }

    // Hero Subtext
    if (data.heroSubtext !== undefined) {
      html += '<div class="editor-section"><h3>Hero Subtitle</h3>' +
        '<div class="form-group"><textarea class="field" data-key="heroSubtext" rows="2">' + escAttr(data.heroSubtext) + '</textarea></div></div>';
    }

    // Section 1
    if (data.section1Heading !== undefined) {
      html += '<div class="editor-section"><h3>Section 1 - Text Content</h3>';
      html += '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="section1Heading" value="' + escAttr(data.section1Heading) + '"></div>';
      html += '<div class="form-group"><label>Paragraph 1</label><textarea class="field" data-key="section1Text1" rows="3">' + escAttr(data.section1Text1 || '') + '</textarea></div>';
      html += '<div class="form-group"><label>Paragraph 2</label><textarea class="field" data-key="section1Text2" rows="3">' + escAttr(data.section1Text2 || '') + '</textarea></div>';

      if (data.section1Image !== undefined) {
        html += '<div class="form-group"><label>Image URL</label>' +
          '<div style="display:flex;gap:0.5rem"><input type="text" class="field" data-key="section1Image" value="' + escAttr(data.section1Image) + '" style="flex:1">' +
          '<button type="button" class="btn btn-sm btn-upload-img" data-field="section1Image">Upload</button></div></div>';
      }
      html += '</div>';
    }

    // Section 2
    if (data.section2Heading !== undefined) {
      html += '<div class="editor-section"><h3>Section 2 - Text Content</h3>';
      html += '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="section2Heading" value="' + escAttr(data.section2Heading) + '"></div>';
      html += '<div class="form-group"><label>Paragraph 1</label><textarea class="field" data-key="section2Text1" rows="3">' + escAttr(data.section2Text1 || '') + '</textarea></div>';
      html += '<div class="form-group"><label>Paragraph 2</label><textarea class="field" data-key="section2Text2" rows="3">' + escAttr(data.section2Text2 || '') + '</textarea></div>';

      if (data.section2Image !== undefined) {
        html += '<div class="form-group"><label>Image URL</label>' +
          '<div style="display:flex;gap:0.5rem"><input type="text" class="field" data-key="section2Image" value="' + escAttr(data.section2Image) + '" style="flex:1">' +
          '<button type="button" class="btn btn-sm btn-upload-img" data-field="section2Image">Upload</button></div></div>';
      }
      html += '</div>';
    }

    // Gallery
    if (data.gallery) {
      html += '<div class="editor-section"><h3>Gallery Images</h3>';
      html += '<div class="image-upload-area" id="gallery-upload-area">' +
        '<div class="upload-icon">🖼️</div><p>Click or drag images here to add to gallery</p></div>';
      html += '<div class="image-preview" id="gallery-preview">';
      data.gallery.forEach(function (img, i) {
        html += '<div class="image-preview-item" data-index="' + i + '">' +
          '<img src="' + getImageUrl(img) + '" alt="Gallery ' + (i + 1) + '" onerror="this.parentElement.innerHTML=\'<span style=color:#999;font-size:12px;padding:4px;display:block;text-align:center>Image ' + (i + 1) + '</span>\'">' +
          '<button type="button" class="remove-img" data-index="' + i + '">×</button></div>';
      });
      html += '</div>';
      html += '</div>';
    }

    // About-specific
    if (data.aboutHeading !== undefined) {
      html += '<div class="editor-section"><h3>About Section</h3>';
      html += '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="aboutHeading" value="' + escAttr(data.aboutHeading) + '"></div>';
      html += '<div class="form-group"><label>Content (HTML)</label><textarea class="field" data-key="aboutText" rows="4">' + escAttr(data.aboutText || '') + '</textarea></div>';
      html += '</div>';
    }

    // Social Work heading
    if (data.socialWorkHeading !== undefined) {
      html += '<div class="editor-section"><h3>Social Work Section</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="socialWorkHeading" value="' + escAttr(data.socialWorkHeading) + '"></div></div>';
    }

    // Contact heading
    if (data.contactHeading !== undefined) {
      html += '<div class="editor-section"><h3>Contact Section</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="contactHeading" value="' + escAttr(data.contactHeading) + '"></div></div>';
    }

    // Gallery heading
    if (data.galleryHeading !== undefined) {
      html += '<div class="editor-section"><h3>Gallery Section</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="galleryHeading" value="' + escAttr(data.galleryHeading) + '"></div></div>';
    }

    // Footer
    if (data.footerText !== undefined) {
      html += '<div class="editor-section"><h3>Footer</h3>' +
        '<div class="form-group"><label>Footer Text</label><input type="text" class="field" data-key="footerText" value="' + escAttr(data.footerText) + '"></div></div>';
    }

    // Card data (home page)
    if (data.foodCard) {
      html += '<div class="editor-section"><h3>Food Distribution Card</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="foodCard.heading" value="' + escAttr(data.foodCard.heading) + '"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="field" data-key="foodCard.text" rows="2">' + escAttr(data.foodCard.text) + '</textarea></div></div>';
    }
    if (data.educationCard) {
      html += '<div class="editor-section"><h3>Education Support Card</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="educationCard.heading" value="' + escAttr(data.educationCard.heading) + '"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="field" data-key="educationCard.text" rows="2">' + escAttr(data.educationCard.text) + '</textarea></div></div>';
    }
    if (data.outreachCard) {
      html += '<div class="editor-section"><h3>Community Outreach Card</h3>' +
        '<div class="form-group"><label>Heading</label><input type="text" class="field" data-key="outreachCard.heading" value="' + escAttr(data.outreachCard.heading) + '"></div>' +
        '<div class="form-group"><label>Description</label><textarea class="field" data-key="outreachCard.text" rows="2">' + escAttr(data.outreachCard.text) + '</textarea></div></div>';
    }

    // Save & Back Buttons
    html += '<div style="display:flex;gap:1rem;margin-top:1rem">' +
      '<button class="btn btn-success" id="save-changes-btn">Save Changes to GitHub</button>' +
      '<button class="btn btn-outline" id="discard-changes-btn">Discard & Go Back</button>' +
      '</div>';

    container.innerHTML = html;

    // Bind upload buttons
    container.querySelectorAll('.btn-upload-img').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var field = this.getAttribute('data-field');
        uploadAndSetField(field);
      });
    });

    // Bind gallery upload
    var galleryArea = document.getElementById('gallery-upload-area');
    if (galleryArea) {
      galleryArea.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = function () { handleGalleryUpload(input.files); };
        input.click();
      });
      galleryArea.addEventListener('dragover', function (e) { e.preventDefault(); this.classList.add('dragover'); });
      galleryArea.addEventListener('dragleave', function () { this.classList.remove('dragover'); });
      galleryArea.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
        handleGalleryUpload(e.dataTransfer.files);
      });
    }

    // Bind gallery remove buttons
    container.querySelectorAll('.remove-img').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'));
        removeGalleryImage(idx);
      });
    });

    // Bind save
    document.getElementById('save-changes-btn').addEventListener('click', saveChanges);

    // Bind discard
    document.getElementById('discard-changes-btn').addEventListener('click', function () {
      if (confirm('Discard all unsaved changes?')) renderDashboard();
    });
  }

  function escAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function getImageUrl(path) {
    if (path.startsWith('http')) return path;
    return 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + GITHUB_BRANCH + '/docs/' + path;
  }

  function collectFieldData() {
    var data = JSON.parse(JSON.stringify(originalData[currentPage]));
    document.querySelectorAll('.field').forEach(function (el) {
      var key = el.getAttribute('data-key');
      var val = el.value;
      var keys = key.split('.');
      var obj = data;
      for (var i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = val;
    });
    return data;
  }

  async function uploadAndSetField(fieldKey) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function () {
      if (!input.files[0]) return;
      loading(true);
      try {
        var url = await uploadImage(input.files[0]);
        var rawUrl = GITHUB_OWNER + '/' + GITHUB_REPO + '/main/docs/uploads/' + url.split('/').pop();
        showToast('Image uploaded! Copy the URL to use it.', 'success');
        var inp = document.querySelector('.field[data-key="' + fieldKey + '"]');
        if (inp) inp.value = 'uploads/' + url.split('/').pop();
      } catch (e) {
        showToast('Upload failed: ' + e.message, 'error');
      }
      loading(false);
    };
    input.click();
  }

  function handleGalleryUpload(files) {
    Array.from(files).forEach(function (file) {
      if (!siteData[currentPage].gallery) siteData[currentPage].gallery = [];
      loading(true);
      uploadImage(file).then(function (url) {
        var filename = url.split('/').pop();
        var relPath = 'uploads/' + filename;
        siteData[currentPage].gallery.push(relPath);
        renderEditor(currentPage);
        loading(false);
        showToast('Image added to gallery', 'success');
      }).catch(function (e) {
        loading(false);
        showToast('Upload failed: ' + e.message, 'error');
      });
    });
  }

  function removeGalleryImage(idx) {
    if (!siteData[currentPage].gallery) return;
    siteData[currentPage].gallery.splice(idx, 1);
    renderEditor(currentPage);
  }

  async function saveChanges() {
    if (!getToken()) {
      showToast('Please configure your GitHub token in Settings first', 'error');
      return;
    }
    var newData = collectFieldData();
    siteData[currentPage] = newData;
    var fullData = JSON.parse(JSON.stringify(siteData));

    loading(true);
    try {
      var content = JSON.stringify(fullData, null, 2);
      await commitFile(SITE_DATA_PATH, content, 'Update ' + currentPage + ' page content via admin panel');
      originalData = JSON.parse(JSON.stringify(siteData));
      showToast('Changes saved! Vercel will auto-deploy in a few minutes.', 'success');
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error');
    }
    loading(false);
  }

  // ========== INIT ==========
  async function initApp() {
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('app-view').style.display = 'block';
    setupSettings();
    if (getToken()) {
      renderDashboard();
    } else {
      showView('view-settings');
      document.getElementById('settings-status').textContent = 'Enter your GitHub token to begin';
    }
  }

  function setupSettings() {
    var token = getToken();
    if (token) document.getElementById('token-input').value = token;
  }

  // ========== STARTUP ==========
  if (sessionStorage.getItem('admin_auth') === '1') {
    initApp();
  } else {
    showView('view-login');
  }

})();
