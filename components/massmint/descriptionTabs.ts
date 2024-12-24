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
          "attributes": [{
            "value": "white",
            "trait_type": "color"
          }, {
            "value": "happy",
            "trait_type": "expression"
          }],
          "price": 2.45
      },
      {
          "file": "file2.jpg",
          "name": "Image2",
          "attributes": [{
            "value": "blue",
            "trait_type": "color"
          }, {
            "value": "shy",
            "trait_type": "expression"
          }],
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
  file,name,description,attributes,price
  file1.jpg,Image1,This is an image,"color:white;expression:happy",100
  file2.jpg,Image2,,"color:blue;expression:shy",200
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
  attributes: [{"value": "white","trait_type": "color"},{"value": "happy","trait_type": "expression"}]
  price: 100 KSM
  
  file: file2.jpg
  name: Image2
  attributes: [{"value": "blue","trait_type": "color"},{"value": "shy","trait_type": "expression"}]
  price: 200
  
  file: file3.jpg
  description: This is another image
  price: 1
  \`\`\`
  `,
  },
}
