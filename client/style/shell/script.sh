echo "" > ./style/shell/bundle.styl
for file in $(find './src' -name '*.styl');
do
  echo "@import('"$file"')" >> ./style/shell/bundle.styl
done