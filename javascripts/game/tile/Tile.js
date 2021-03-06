define([
	'game/Global'
], function(
	Global
) {
	function Tile(params) {
		this.type = params.type;
		this._tileGrid = null;
		this.col = null;
		this.row = null;
		this._occupants = [];
		this._reservedFor = [];
	}
	Tile.prototype.addToTileGrid = function(tileGrid, col, row) {
		this._tileGrid = tileGrid;
		this.col = col;
		this.row = row;
	};
	Tile.prototype.canEnter = function(occupant, moveX, moveY) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() &&
				!this._occupants[i].canEnter(occupant, moveX, moveY)) {
				return false;
			}
		}
		for(i = 0; i < this._reservedFor.length; i++) {
			if(this._reservedFor[i].isAlive() &&
				!this._reservedFor[i].canEnter(occupant, moveX, moveY)) {
				return false;
			}
		}
		return true;
	};
	Tile.prototype.canPush = function(occupant, moveX, moveY) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive()) {
				if(this._occupants[i].isPushable) {
					if(!this._occupants[i].canPush(occupant, moveX, moveY)) {
						return false;
					}
				}
				else if(!this._occupants[i].canEnter(occupant, moveX, moveY)) {
					return false;
				}
			}
		}
		for(i = 0; i < this._reservedFor.length; i++) {
			if(this._reservedFor[i].isAlive()) {
				if(!this._reservedFor[i].canEnter(occupant, moveX, moveY)) {
					return false;
				}
			}
		}
		return true;
	};
	Tile.prototype.pushOccupants = function(occupant, moveX, moveY, speed) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() && this._occupants[i].isPushable) {
				this._occupants[i].push(occupant, moveX, moveY, speed);
			}
		}
	};
	Tile.prototype.canLeave = function(occupant, moveX, moveY) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() &&
				!this._occupants[i].canLeave(occupant, moveX, moveY)) {
				return false;
			}
		}
		return true;
	};
	Tile.prototype.isVirtuallyEmpty = function(allowCarriers) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() && this._occupants[i].fillsTile &&
				(!allowCarriers || !this._occupants[i].canCarryItems)) {
				return false;
			}
		}
		return true;
	};
	Tile.prototype.use = function(obj, dir, isDistant) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() && this._occupants[i].use(obj, dir, isDistant)) {
				return true;
			}
		}
		return false;
	};
	Tile.prototype.reserveForOccupant = function(occupant, triggerEvents) {
		this._reservedFor.push(occupant);
	};
	Tile.prototype.getOccupants = function() {
		return this._occupants;
	};
	Tile.prototype.addOccupant = function(occupant, triggerEvents) {
		if(occupant.isAlive() && triggerEvents !== false) {
			for(var i = 0; i < this._occupants.length; i++) {
				if(this._occupants[i].isAlive()) {
					this._occupants[i].onEnter(occupant);
				}
			}
		}
		this._reservedFor = this._reservedFor.filter(function(otherOccupant) {
			return !otherOccupant.sameAs(occupant);
		});
		this._occupants.push(occupant);
	};
	Tile.prototype.removeOccupant = function(occupant, triggerEvents) {
		this._occupants = this._occupants.filter(function(otherOccupant) {
			return !otherOccupant.sameAs(occupant);
		});
		this._reservedFor = this._reservedFor.filter(function(otherOccupant) {
			return !otherOccupant.sameAs(occupant);
		});
		if(occupant.isAlive() && triggerEvents !== false) {
			for(var i = 0; i < this._occupants.length; i++) {
				if(this._occupants[i].isAlive()) {
					this._occupants[i].onLeave(occupant);
				}
			}
		}
	};
	Tile.prototype.renderOccupants = function(ctx, camera) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() && !this._occupants[i].renderAboveRowBelow()) {
				this._occupants[i].render(ctx, camera);
			}
		}
	};
	Tile.prototype.renderPriorityOccupants = function(ctx, camera) {
		for(var i = 0; i < this._occupants.length; i++) {
			if(this._occupants[i].isAlive() && this._occupants[i].renderAboveRowBelow()) {
				this._occupants[i].render(ctx, camera);
			}
		}
	};
	Tile.prototype.render = function(ctx, camera) { //to be overridden
		if(Global.DEBUG_DRAW_GRIDLINES) {
			ctx.strokeStyle = '#00f';
			ctx.lineWidth = 1;
			ctx.strokeRect(this.col * Global.TILE_WIDTH - camera.x,
				this.row * Global.TILE_HEIGHT - camera.y,
				Global.TILE_WIDTH, Global.TILE_HEIGHT);
		}
	};
	return Tile;
});