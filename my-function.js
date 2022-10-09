function main(args) {
  let keywords = args.keyword
  let greeting = 'Aman says ' + keywords + '!'
  console.log(greeting)
  return {"body": greeting}
}
  
