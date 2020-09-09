'use strict'

const users = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password_digest: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  verified_date: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const ipns = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  status_code: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ipn_request: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const wallets = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  user_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'user_id'
    },
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: 'My Wallet'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const balances = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  wallet_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'wallets',
      key: 'id',
      as: 'wallet_id'
    },
    allowNull: false
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    defaultValue: 0.0
  },
  amountOnHold: {
    type: Sequelize.FLOAT,
    defaultValue: 0.0
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const addresses = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  balance_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'balances',
      key: 'id',
      as: 'balance_id'
    },
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  label: {
    type: Sequelize.STRING,
    allowNull: true
  },
  dest_tag: {
    type: Sequelize.STRING,
    allowNull: true
  },
  priv_key: {
    type: Sequelize.STRING,
    allowNull: true
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const deposits = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  user_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'user_id'
    },
    allowNull: false
  },
  wallet_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'wallets',
      key: 'id',
      as: 'wallet_id'
    },
    allowNull: false
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  create_request: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const withdrawals = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  balance_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'balances',
      key: 'id',
      as: 'balance_id'
    },
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tag: {
    type: Sequelize.STRING,
    allowNull: true
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status_text: {
    type: Sequelize.STRING,
    defaultValue: '{}'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const tokens = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT
  },
  user_id: {
    type: Sequelize.BIGINT,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'user_id'
    },
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  valid_to: {
    type: Sequelize.DATE
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
})

const addUnique = (queryInterface, tableName, fields) => {
  return queryInterface.addIndex(tableName, fields, {
    name: tableName + 'Unique',
    unique: true
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const usersP = queryInterface.createTable('users', users(Sequelize))
      const ipnsP = queryInterface.createTable('ipns', ipns(Sequelize))
      return Promise.all([usersP, ipnsP])
        .then(() => {
          const walletsP = queryInterface.createTable('wallets', wallets(Sequelize))
          const tokensP = queryInterface.createTable('tokens', tokens(Sequelize))
          return Promise.all([walletsP, tokensP])
            .then(() => {
              const balancesP = queryInterface.createTable('balances', balances(Sequelize))
              return Promise.all([balancesP])
                .then(() => {
                  const addressesP = queryInterface.createTable('addresses', addresses(Sequelize))
                  const depositsP = queryInterface.createTable('deposits', deposits(Sequelize))
                  const withdrawalsP = queryInterface.createTable('withdrawals', withdrawals(Sequelize))
                  return Promise.all([addressesP, depositsP, withdrawalsP])
                    .then(() => {
                      const balancesU = addUnique(queryInterface, 'balances', ['wallet_id', 'symbol'])
                      return Promise.all([balancesU])
                    })
                })
            })
        })
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      const addressesP = queryInterface.dropTable('addresses')
      const depositsP = queryInterface.dropTable('deposits')
      const withdrawalsP = queryInterface.dropTable('withdrawals')
      return Promise.all([addressesP, depositsP, withdrawalsP])
        .then(() => {
          const balancesP = queryInterface.dropTable('balances')
          return Promise.all([balancesP])
            .then(() => {
              const walletsP = queryInterface.dropTable('wallets')
              const tokensP = queryInterface.dropTable('tokens')
              return Promise.all([walletsP, tokensP])
                .then(() => {
                  const usersP = queryInterface.dropTable('users')
                  const ipnsP = queryInterface.dropTable('ipns')
                  return Promise.all([usersP, ipnsP])
                })
            })
        })
    })
  }
}