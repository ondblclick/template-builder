const ejs = require('ejs');
const fs = require('fs');
const posthtml = require('posthtml');

const encoding = 'utf8';
const input = JSON.parse(fs.readFileSync(process.argv[2], encoding));

const FOLDER_TYPE = 'text/directory';
const SUPPORTED_IMAGES = ['png', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'arw', 'srf', 'sr2', 'crw', 'cr2', 'nef', 'nrw', 'kdc', 'dcr', 'orf', 'ptx', 'pef', 'raf', 'raw', 'dng', 'rw2', 'x3f', 'srw', '3fr', 'mrw', 'heic', 'psd'];
const SUPPORTED_VIDEOS = ['qt', 'mov', 'mp4', 'm4v', 'avi', 'mkv', 'webm', 'ogg', 'wmv', '3gp', 'mpg', 'mpeg', 'flv', 'dp', 'dpg', 'm2t', 'm2ts', 'm2v', 'rm', 'mts', 'ts', 'tp', 'asf', 'vob', 'm1v', 'dv', 'divx', 'xvid'];
const SUPPORTED_AUDIOS = ['mp3', 'wma', 'wav', 'm4a'];
const THUMBS = [...SUPPORTED_IMAGES, ...SUPPORTED_VIDEOS];

const getImage = ext =>
  ([
    { key: 'pdf', exts: ['pdf'] },
    { key: 'mspowerpoint', exts: ['pptx', 'ppt', 'potx', 'potm', 'pot', 'pps', 'ppsm', 'ppa', 'pps', 'ppam', 'ppsx', 'pptm'] },
    { key: 'msoutlook', exts: ['pst', 'ost'] },
    { key: 'msexcel', exts: ['xlsx', 'xlsm', 'xlsb', 'xltx', 'xls', 'xlt', 'xla', 'csv'] },
    { key: 'msword', exts: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'rtf'] },
    { key: 'access', exts: ['accdb', 'accde', 'accdt', 'accdr', 'laccdb', 'mdb'] },
    { key: 'msproject', exts: ['mpp', 'mpt', 'mpx', 'mpd'] },
    { key: 'mspublisher', exts: ['pub', 'pubhtml', 'pubmhtml', 'puz'] },
    { key: 'msvisio', exts: ['vsdx', 'vsdm', 'vssx', 'vssm', 'vstx', 'vstm'] },
    { key: 'photoshop', exts: ['psd', 'psb'] },
    { key: 'illustrator', exts: ['ai', 'ait'] },
    { key: 'msonenote', exts: ['one'] },
    { key: 'gdoc', exts: ['gdoc'] },
    { key: 'gdraw', exts: ['gdraw'] },
    { key: 'gform', exts: ['gform'] },
    { key: 'gsheet', exts: ['gsheet'] },
    { key: 'gslide', exts: ['gslides'] },
    { key: 'gtable', exts: ['gtable'] },
    { key: 'keynote', exts: ['key'] },
    { key: 'numbers', exts: ['numbers'] },
    { key: 'pages', exts: ['pages'] },
    { key: 'postscript', exts: ['ps', 'eps'] },
    { key: 'autodesk', exts: ['dwg', 'dxf', 'dxf', 'rcp'] },
    { key: 'archive', exts: ['zip', 'rar', '7z'] },
    { key: 'font', exts: ['abf', 'acfm', 'afm', 'amfm', 'bdf', 'cha', 'chr', 'compositefont', 'dfont', 'eot', 'etx', 'euf', 'f3f', 'ffil', 'fnt', 'fon', 'fot', 'gdr', 'gf', 'gxf', 'lwfn', 'mcf', 'mf', 'mxf', 'nftr', 'odttf', 'otf', 'pcf', 'pfa', 'pfb', 'pfm', 'pfr', 'pk', 'pmt', 'sfd', 'sfp', 'suit', 't65', 'tfm', 'ttc', 'tte', 'ttf', 'txf', 'vfb', 'vlw', 'vnf', 'woff', 'woff2', 'xfn', 'xft', 'ytf'] },
    { key: 'photo', exts: SUPPORTED_IMAGES },
    { key: 'video', exts: SUPPORTED_VIDEOS },
    { key: 'sound', exts: SUPPORTED_AUDIOS },
  ].find(({ exts }) => exts.includes(ext && ext.toLowerCase())) || {}).key || 'file';

const items = input.attachments.map((i) => {
  const ext = i.filename.split('.').pop();
  const image = getImage(ext);

  if (i.type === FOLDER_TYPE) return {
    ...i,
    folder: true,
    src1x: "./images/blocksmall_folder@2x.png",
    src2x: "./images/block_folder@2x.png",
    src3x: "./images/single_folder@2x.png",
  }

  if (THUMBS.includes(ext)) return {
    ...i,
    image: true,
    src1x: 'http://via.placeholder.com/200x200',
    src2x: 'http://via.placeholder.com/400x400',
    src3x: 'http://via.placeholder.com/800x660',
  };

  return {
    ...i,
    other: true,
    src1x: `./images/blocksmall_${image}@2x.png`,
    src2x: `./images/block_${image}@2x.png`,
    src3x: `./images/single_${image}@2x.png`,
  };
});

const cssPath = 'styles.css';
const css = fs.readFileSync(cssPath, encoding);
const file = fs.readFileSync('index.ejs', encoding);
const html = ejs.render(file, {
  name: "Serj",
  count: "2 folders and 28 files",
  button: "View Files",
  items
}, { root: '.' });

posthtml([
  require('posthtml-inline-css')(css),
  require('posthtml-minifier')({
    removeComments: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
  }),
]).process(html).then(res => console.log(res.html.replace(/(class=".*?")/g, '')));
