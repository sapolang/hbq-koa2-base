 import modelBase from './models/_base'
 import mongoose from 'mongoose'
 const requireHelper = appUtils.requireCommon('requireHelper')
 const Schema = mongoose.Schema
     //自动加载 无需人工引入文件  
 export default {
     init({ debug }) {
         const database = {
             models: {}
         }
         const commonProps = require('./models/_commonProps')(mongoose, Schema);
         requireHelper.requireDir([__dirname, 'models'], (getModel, modelName) => {
             const model = getModel(mongoose, Schema)
             model.collection = {
                 collection: `${modelName}s`
             }
             /**
              * 继承公共属性
              */
             model.props = {...commonProps, ...model.props };

             const modelSchema = new Schema(model.props, model.collection)
             modelSchema.pre('save', (next) => {
                 next()
             })
             modelSchema.pre('update', (next) => {
                 next()
             })
             modelSchema.statics = {...modelBase, ...model.statics }
             database.models[modelName] = mongoose.model(modelName, modelSchema)
             debug("load mongoose model --> " + modelName)
         })
         return database
     }

 }