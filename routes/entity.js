const express = require('express');
const router = express.Router();
const { Entity, Attribute } = require('../models');
router.post('/', async (req, res) => {
  try {
    const { name, attributes } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Entity name must be provided as a non-empty string' });
    }
    const entity = await Entity.create({ name });
    await Promise.all(attributes.map(async (attr) => {
      await Attribute.create({ name: attr.name, type: attr.type, entityId: entity.id });
    }));
    res.status(201).json({ entity });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        message: err.message,
        field: err.path
      }));
      return res.status(400).json({ errors });
    }
    console.error('Error creating entity with attributes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/', async (req, res) => {
    try {
      const entities = await Entity.findAll({ include: Attribute });
      res.status(200).json({ entities });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.get('/:entityId', async (req, res) => {
    try {
      const { entityId } = req.params;
      const entity = await Entity.findByPk(entityId, { include: Attribute });
      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      res.status(200).json({ entity });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.post('/:entityId/attributes/:attributeId', async (req, res) => {
    try {
      const { entityId, attributeId } = req.params;
      const { name, type } = req.body;
      const entity = await Entity.findByPk(entityId);
      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      const attribute = await Attribute.findByPk(attributeId);
      if (!attribute) {
        return res.status(404).json({ error: 'Attribute not found' });
      }
      await attribute.update({ name, type });
  
      res.status(200).json({ attribute });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/:entityId', async (req, res) => {
    try {
        const { entityId } = req.params;
        const { name } = req.body;

        const entity = await Entity.findByPk(entityId);
        if (!entity) {
            return res.status(404).json({ error: 'Entity not found' });
        }

        await entity.update({ name });
        res.status(200).json({ entity });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  

router.delete('/:entityId', async (req, res) => {
    try {
      const { entityId } = req.params;
      const entity = await Entity.findByPk(entityId);
      if (!entity) {
        return res.status(404).json({ error: 'Entity not found' });
      }
      await entity.destroy();
      res.status(204).json();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
router.delete('/:entityId/attributes/:attributeId', async (req, res) => {
    try {
        const { entityId, attributeId } = req.params;
        const entity = await Entity.findByPk(entityId);
        if (!entity) {
            return res.status(404).json({ error: 'Entity not found' });
        }

        const attribute = await Attribute.findOne({
            where: { id: attributeId, entityId: entityId }
        });

        if (!attribute) {
            return res.status(404).json({ error: 'Attribute not found for the entity' });
        }

        await attribute.destroy();
        res.status(204).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/:entityId/attributes', async (req, res) => {
  try {
      const { entityId } = req.params;
      const { name, type } = req.body;

      const entity = await Entity.findByPk(entityId);
      if (!entity) {
          return res.status(404).json({ error: 'Entity not found' });
      }

      const attribute = await Attribute.create({ name, type, entityId });
      res.status(201).json({ attribute });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;