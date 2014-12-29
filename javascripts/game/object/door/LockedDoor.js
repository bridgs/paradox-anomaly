define([
	'game/object/door/Door',
	'game/util/extend',
	'game/util/toOppositeDirection'
], function(
	SUPERCLASS,
	extend,
	toOppositeDirection
) {
	function LockedDoor(params) {
		SUPERCLASS.call(this, extend(params, { debugColor: '#f00' }));
	}
	LockedDoor.prototype = Object.create(SUPERCLASS.prototype);
	LockedDoor.prototype.use = function(obj, dir, isDistant) {
		if(this.isAlive() && obj.isAlive() && this.isLocked() && obj.canCarryItems &&
			obj.isCarryingItem() && this.sameAs(obj.getCarriedItem().door) &&
			((!isDistant && dir === this._dir) ||
			(isDistant && toOppositeDirection(dir) === this._dir))) {
			this.unlock();
			return true;
		}
		return SUPERCLASS.prototype.use.call(obj, dir, isDistant);
	};
	return LockedDoor;
});