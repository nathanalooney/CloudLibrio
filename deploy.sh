#!/bin/bash
rm tmp/*
echo 'Compiling React JSX...'
node_modules/.bin/babel --presets react Public/js/player.js -o tmp/player-compiled.js
echo 'Minimizing Compiled Javascript...'
node_modules/.bin/uglifyjs tmp/player-compiled.js -m -c -o tmp/player-minified.js
rm tmp/player-compiled.js
echo 'Building index.html...'
sed '$ d' Public/index.html > tmp/tmp.html
sed '$ d' tmp/tmp.html > tmp/index.html
rm tmp/tmp.html
echo '<script>' >>  tmp/index.html
cat tmp/player-minified.js >> tmp/index.html
rm tmp/player-minified.js
sed -i '' -e '$a\' tmp/index.html
echo '</script>' >> tmp/index.html
echo '</html>' >> tmp/index.html
echo 'Pushing to Amazon S3...'
aws s3 cp tmp/index.html s3://cloudlibr.io/ --acl public-read
echo 'Cleaning Up...'
rm tmp/*
