export const descriptionTabs = {
  JSON: {
    label: 'JSON',
    fileStructureDescription: `
  \`\`\`json
  [
      {
          "file": "file1.jpg",
          "name": "Image1",
          "description": "This is an image",
          "price": 2.45
      },
      {
          "file": "file2.jpg",
          "name": "Image2",
          "price": 200
      },
      {
          "file": "file3.jpg",
          "description": "This is another image"
      }
  ]
  \`\`\`
  `,
  },

  // https://highlightjs.readthedocs.io/en/latest/supported-languages.html
  // csv is not supported by highlight.js
  // properties gives a decent highlighting
  CSV: {
    label: 'CSV',
    fileStructureDescription: `
  \`\`\`properties
  file,name,description,price
  file1.jpg,Image1,This is an image,100
  file2.jpg,Image2,,200
  file3.jpg,,This is another image,
  \`\`\`
  `,
  },
  // https://highlightjs.readthedocs.io/en/latest/supported-languages.html
  // properties gives a better highlighting then txt
  TXT: {
    label: 'TXT',
    fileStructureDescription: `
  \`\`\`properties
  file: file1.jpg
  name: Image1
  description: This is an image
  price: 100 KSM
  
  file: file2.jpg
  name: Image2
  price: 200
  
  file: file3.jpg
  description: This is another image
  price: 1
  \`\`\`
  `,
  },
}
