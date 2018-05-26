const { logger } = require('../util/misc');
const download = require('image-downloader');
const path = require('path');
const Jimp = require('jimp');
const generateName = require('sillyname');

const options = {
  dest: path.join(__dirname, '../images')
};

exports.thumbnail = async (req, res) => {
  const { url } = req.query;
  const sillyName = generateName();
  const uri = decodeURIComponent(url);
  const op = {
    ...options,
    url: uri,
    dest: path.join(__dirname, `../images/${sillyName}.jpg`)
  };
  const { filename } = await download.image(op);
  const image = await Jimp.read(filename);
  const filepath = path.join(__dirname, '../images');
  await image
    .resize(50, 50)
    .quality(60)
    .write(`${filepath}/${sillyName}.jpg`);
  res.redirect(`../image/${sillyName}.jpg`);
};

exports.getImage = (req, res) =>
  res.sendFile(
    req.params.id,
    {
      root: path.join(__dirname, '../images')
    },
    err => {
      if (err) {
        logger.error(err);
      }
    }
  );
