export default {
  metadataVersion: '0.1.0',
  source: {
    hash: '',
    language: 'ask v0.1',
    compiler: 'ask v0.1'
  },
  contract: {
    name: 'myERC721',
    version: '1.0',
    authors: [],
    description: null,
    documentation: null,
    repository: null,
    homepage: null,
    license: null
  },
  spec: {
    constructors: [
      {
        args: [
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'name'
          },
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'symbol'
          }
        ],
        docs: [''],
        name: ['default'],
        selector: '0xed4b9d1b'
      },
      {
        args: [],
        docs: [''],
        name: ['new'],
        selector: '0x9bae9d5e'
      }
    ],
    messages: [
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'baseURI'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['mint'],
        selector: '0xcfdd9aa2'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['transfer'],
        selector: '0x84a15da1'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['burn'],
        selector: '0xb1efc17b'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          },
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'tokenURI'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['setTokenURI'],
        selector: '0xcfe471c7'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'baseURI'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['setBaseURI'],
        selector: '0x240f21b7'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          },
          {
            type: {
              type: 4,
              displayName: ['u8']
            },
            name: 'amount'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['setRoyalty'],
        selector: '0xefc206f7'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          },
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: 'data'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['emote'],
        selector: '0x1aeb77e9'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'amount'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['list'],
        selector: '0x832a283f'
      },
      {
        mutates: true,
        payable: true,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['buy'],
        selector: '0x15d62801'
      },
      {
        mutates: true,
        payable: true,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['send'],
        selector: '0xe6faf2c0'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'owner'
          }
        ],
        returnType: {
          type: 6,
          displayName: ['i32']
        },
        docs: [''],
        name: ['balanceOf'],
        selector: '0xf48def67'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 2,
          displayName: ['AccountId']
        },
        docs: [''],
        name: ['ownerOf'],
        selector: '0xadf54612'
      },
      {
        mutates: false,
        payable: false,
        args: [],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['name'],
        selector: '0x3adaf70d'
      },
      {
        mutates: false,
        payable: false,
        args: [],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['symbol'],
        selector: '0x9bd1933e'
      },
      {
        mutates: false,
        payable: false,
        args: [],
        returnType: {
          type: 2,
          displayName: ['AccountId']
        },
        docs: [''],
        name: ['owner'],
        selector: '0xfeaea4fa'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['tokenURI'],
        selector: '0x97731a4e'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 5,
          displayName: ['u128']
        },
        docs: [''],
        name: ['priceOf'],
        selector: '0xdb1de8ae'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['emoteOf'],
        selector: '0x85167098'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['royaltyOf'],
        selector: '0x7343cd3c'
      },
      {
        mutates: false,
        payable: false,
        args: [],
        returnType: {
          type: 1,
          displayName: ['string']
        },
        docs: [''],
        name: ['baseURI'],
        selector: '0x6e726f9e'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'owner'
          },
          {
            type: {
              type: 6,
              displayName: ['i32']
            },
            name: 'index'
          }
        ],
        returnType: {
          type: 5,
          displayName: ['u128']
        },
        docs: [''],
        name: ['tokenOfOwnerByIndex'],
        selector: '0xe95b8cf1'
      },
      {
        mutates: false,
        payable: false,
        args: [],
        returnType: {
          type: 6,
          displayName: ['i32']
        },
        docs: [''],
        name: ['totalSupply'],
        selector: '0xcae60595'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 6,
              displayName: ['i32']
            },
            name: 'index'
          }
        ],
        returnType: {
          type: 5,
          displayName: ['u128']
        },
        docs: [''],
        name: ['tokenByIndex'],
        selector: '0x6b04701b'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['approve'],
        selector: '0x681266a0'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: {
          type: 2,
          displayName: ['AccountId']
        },
        docs: [''],
        name: ['getApproved'],
        selector: '0xbab634be'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'operator'
          },
          {
            type: {
              type: 7,
              displayName: ['bool']
            },
            name: 'approved'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['setApprovalForAll'],
        selector: '0x76c7d8b8'
      },
      {
        mutates: false,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'owner'
          },
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'operator'
          }
        ],
        returnType: {
          type: 7,
          displayName: ['bool']
        },
        docs: [''],
        name: ['isApprovedForAll'],
        selector: '0xf0b05132'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'from'
          },
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['transferFrom'],
        selector: '0x02a6e0d5'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['transfer'],
        selector: '0x84a15da1'
      },
      {
        mutates: true,
        payable: false,
        args: [
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'from'
          },
          {
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            name: 'to'
          },
          {
            type: {
              type: 5,
              displayName: ['u128']
            },
            name: 'tokenId'
          },
          {
            type: {
              type: 1,
              displayName: ['string']
            },
            name: '_data'
          }
        ],
        returnType: null,
        docs: [''],
        name: ['safeTransferFrom'],
        selector: '0x58e10c13'
      }
    ],
    events: [
      {
        name: 'Transfer',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'from'
          },
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'to'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'tokenId'
          }
        ],
        docs: []
      },
      {
        name: 'Approval',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'owner'
          },
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'approved'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'tokenId'
          }
        ],
        docs: []
      },
      {
        name: 'ApprovalForAll',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'owner'
          },
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'operator'
          },
          {
            indexed: false,
            type: {
              type: 7,
              displayName: ['bool']
            },
            docs: [''],
            name: 'approved'
          }
        ],
        docs: []
      },
      {
        name: 'Emoted',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'from'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'tokenId'
          },
          {
            indexed: false,
            type: {
              type: 1,
              displayName: ['string']
            },
            docs: [''],
            name: 'emote'
          }
        ],
        docs: []
      },
      {
        name: 'RoyaltySet',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'from'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'tokenId'
          },
          {
            indexed: true,
            type: {
              type: 4,
              displayName: ['u8']
            },
            docs: [''],
            name: 'amount'
          }
        ],
        docs: []
      },
      {
        name: 'Listed',
        args: [
          {
            indexed: true,
            type: {
              type: 2,
              displayName: ['AccountId']
            },
            docs: [''],
            name: 'from'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'tokenId'
          },
          {
            indexed: true,
            type: {
              type: 5,
              displayName: ['u128']
            },
            docs: [''],
            name: 'amount'
          }
        ],
        docs: []
      }
    ],
    docs: ['']
  },
  types: [
    {
      def: {
        primitive: 'str'
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              type: 3
            }
          ]
        }
      }
    },
    {
      def: {
        array: {
          len: 32,
          type: 4
        }
      }
    },
    {
      def: {
        primitive: 'u8'
      }
    },
    {
      def: {
        primitive: 'u128'
      }
    },
    {
      def: {
        primitive: 'i32'
      }
    },
    {
      def: {
        primitive: 'bool'
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 2
            },
            {
              name: 'value',
              type: 9
            }
          ]
        }
      }
    },
    {
      def: {
        sequence: {
          type: 5
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 5
            },
            {
              name: 'value',
              type: 2
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 2
            },
            {
              name: 'value',
              type: 12
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 2
            },
            {
              name: 'value',
              type: 13
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: '_value',
              type: 7
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 5
            },
            {
              name: 'value',
              type: 15
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: '_valueStr',
              type: 1
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 5
            },
            {
              name: 'value',
              type: 4
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 5
            },
            {
              name: 'value',
              type: 18
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 2
            },
            {
              name: 'value',
              type: 15
            }
          ]
        }
      }
    },
    {
      def: {
        composite: {
          fields: [
            {
              name: 'key_index',
              type: 5
            },
            {
              name: 'value',
              type: 5
            }
          ]
        }
      }
    }
  ],
  storage: {
    struct: {
      fields: [
        {
          name: '_holderTokens',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0xf98436cbd85c28f9ed425cbce36cd7b4295db72ef7840c5f86b5aa8813579c9c',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0xf98436cbd85c28f9ed425cbce36cd7b4295db72ef7840c5f86b5aa8813579c9c',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xd24585b37c9f08773450df9ac6fbfa0d8002836cb010e289975fbb7e0b7a8bd7',
                      ty: 2
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0xf98436cbd85c28f9ed425cbce36cd7b4295db72ef7840c5f86b5aa8813579c9c',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0xf98436cbd85c28f9ed425cbce36cd7b4295db72ef7840c5f86b5aa8813579c9c',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xdbf24c87dd876a0d688307464aea1fc163f1277b19243192fda1d8f3d79ecf45',
                      ty: 9
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_tokenOwners',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x7dff4a53e8bbf16253748b2651afa694883a8193aea4924aabe73c2a4b921ea3',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x7dff4a53e8bbf16253748b2651afa694883a8193aea4924aabe73c2a4b921ea3',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x755beeca8e08477a05763ea2e04241c975282b48fad9f7b885498e86f89b910a',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x7dff4a53e8bbf16253748b2651afa694883a8193aea4924aabe73c2a4b921ea3',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x7dff4a53e8bbf16253748b2651afa694883a8193aea4924aabe73c2a4b921ea3',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xc1a1b3ccc7c6a91b4d7a8847b31c01f64f69fb8baefb6d13fa8e8f0d005c9309',
                      ty: 2
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_tokenApprovals',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x4f87d47e02973f419ca54631cb93f5e1b1e53fa3a1fa3bb46d3d3f5b6998a7a2',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x4f87d47e02973f419ca54631cb93f5e1b1e53fa3a1fa3bb46d3d3f5b6998a7a2',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x3920e6ca50cd79d92fe8822b1b3f83a7ced6c7d35c00ec7818815b27afb76456',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x4f87d47e02973f419ca54631cb93f5e1b1e53fa3a1fa3bb46d3d3f5b6998a7a2',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x4f87d47e02973f419ca54631cb93f5e1b1e53fa3a1fa3bb46d3d3f5b6998a7a2',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x6fa2b0cb5f8f24aca2980f43dd1777f52bfbf3c25e1b80f65bb967f939bac993',
                      ty: 2
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_operatorApprovals',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x6be5e41e8a3d585f3d968f259b49c6b8e45e7f7c054088b6aef659b46259aa6a',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x6be5e41e8a3d585f3d968f259b49c6b8e45e7f7c054088b6aef659b46259aa6a',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x32d9d0ef8e3f17f85a57e4fc4cc5338ec00acd23f84508c82cb3feb51bb3309e',
                      ty: 2
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x6be5e41e8a3d585f3d968f259b49c6b8e45e7f7c054088b6aef659b46259aa6a',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x6be5e41e8a3d585f3d968f259b49c6b8e45e7f7c054088b6aef659b46259aa6a',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x233b96f7eb77b7066a31b61ac600ab03eb75e24df3ec5fd84be74f3046eb437d',
                      ty: 12
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_name',
          layout: {
            key:
              '0x6b8036b8ec13809e7ea0509915cf92cb2d944b6808b952db58e4eb04ec266849',
            ty: 1
          }
        },
        {
          name: '_symbol',
          layout: {
            key:
              '0x58effea2b3513cc61a2763948f97f479fa2a2ebb0ccdbdf856d2553fc79ba86d',
            ty: 1
          }
        },
        {
          name: '_tokenURIs',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x1407b693c0e74419f3d162bb224825163eb023a6435015d0cb78b33c3bfd9220',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x1407b693c0e74419f3d162bb224825163eb023a6435015d0cb78b33c3bfd9220',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xda2178cad0ad0c1d91ee5d7c07505e491374064f580d40d7b256caca380fa0bc',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x1407b693c0e74419f3d162bb224825163eb023a6435015d0cb78b33c3bfd9220',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x1407b693c0e74419f3d162bb224825163eb023a6435015d0cb78b33c3bfd9220',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xb31b997299c1ccdd1b4c18eeaac8bc2617e1a9bafa3b9c9550d34bd66a24060d',
                      ty: 15
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_baseURI',
          layout: {
            key:
              '0xf70ca09aa4ad5b83a6ed53057b3793e4438f409dc0701d42be5d38656c094802',
            ty: 1
          }
        },
        {
          name: '_owner',
          layout: {
            struct: {
              fields: [
                {
                  name: 'len',
                  layout: {
                    key:
                      '0x40e7f569499522df79b4a7faa6146448a66b23f51b6c2bc73edbee0003c884aa',
                    ty: 2
                  }
                },
                {
                  name: 'elems',
                  layout: {
                    offset:
                      '0x65301805c2d10c892f2baf466e5e8ca7c08217170abd3c16253a9b0e83728e83',
                    len: 0,
                    cellsPerElem: 1,
                    layout: {
                      key:
                        '0x40e7f569499522df79b4a7faa6146448a66b23f51b6c2bc73edbee0003c884aa',
                      ty: 2
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_tokenRoyalty',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x0f1083be2545b778374e5e467cbb2f38c1a6066b8073276b35676ed1d3ef6e1d',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x0f1083be2545b778374e5e467cbb2f38c1a6066b8073276b35676ed1d3ef6e1d',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x338e8c7686616c7f8b5e4fae3d9cc90f05651c8bb69bc9656f036093329bbc74',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x0f1083be2545b778374e5e467cbb2f38c1a6066b8073276b35676ed1d3ef6e1d',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x0f1083be2545b778374e5e467cbb2f38c1a6066b8073276b35676ed1d3ef6e1d',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x7014845bd060927f12e8100c83badd5b7e431e2a336b2d8b3678ec5def7c7f6b',
                      ty: 4
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_counter',
          layout: {
            key:
              '0xf41936e2b11f8b2c9a5a546c0ceb6e8aa2c06be3da6291dbfa803a6742027799',
            ty: 5
          }
        },
        {
          name: '_emotes',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x10b8c071e912609b1bffe6beed34aaf475edfde14d0f746332d3015157617e5e',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x10b8c071e912609b1bffe6beed34aaf475edfde14d0f746332d3015157617e5e',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x6ca7c91d540a2cce7edea1cffcd116f57a87b92252c899fb485f059fabf91094',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x10b8c071e912609b1bffe6beed34aaf475edfde14d0f746332d3015157617e5e',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x10b8c071e912609b1bffe6beed34aaf475edfde14d0f746332d3015157617e5e',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0xbed35488cae3b861966602b30315229566e68d7166c1f54ccdd8fc08fcf13820',
                      ty: 18
                    }
                  }
                }
              ]
            }
          }
        },
        {
          name: '_balances',
          layout: {
            struct: {
              fields: [
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x0d9640ff52037011985cf4f388e0e70786910be803d1687e0cfbaf8996574160',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x0d9640ff52037011985cf4f388e0e70786910be803d1687e0cfbaf8996574160',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x072f1fc5daf9e283e9462b542cf755ad4c554f898d080a6160572a4f354a96fe',
                      ty: 5
                    }
                  }
                },
                {
                  name: 'values',
                  layout: {
                    offset:
                      '0x0d9640ff52037011985cf4f388e0e70786910be803d1687e0cfbaf8996574160',
                    strategy: {
                      hasher: 'Blake2x256',
                      prefix:
                        '0x0d9640ff52037011985cf4f388e0e70786910be803d1687e0cfbaf8996574160',
                      postfix: ''
                    },
                    layout: {
                      key:
                        '0x457197399668fa71500aa0dba4f29d13193aa7c99f55faecc51ebe9bca322bdc',
                      ty: 5
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
};
