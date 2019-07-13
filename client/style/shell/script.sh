echo "" > ./style/shell/bundle.styl
mkdir -p public/css/
printf "\033[1;31m"
printf "Injecting stylus file...\n"
for file in $(find './src' -name '*.styl');
do
  echo "@import('"$file"')" >> ./style/shell/bundle.styl
done
echo "Injection Complete!"
printf '\033[0m;'