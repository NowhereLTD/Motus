

class WorkSteps {
  constructor() {
    this.steps = [];
    this.rollbackPoints = [];
    this.oldSteps = [];
    this.oldRollbackPoints = [];
  }

  push(data, type) {

    let time = new Date();
    let id = this.steps.length;
    this.steps[id] = {};
    this.steps[id].time = time.getTime();
    this.steps[id].data = data;
    this.steps[id].type = type;
    return id;

  }

  setRollbackPoint() {
    this.rollbackPoints.push(this.steps.length);
  }

  rollbackToLastPoint() {
    if(this.rollbackPoints.length == 0) {
      return;
    }

    if(this.rollbackPoints[this.rollbackPoints.length-2]) {
      this.rollback(this.rollbackPoints[this.rollbackPoints.length-2]);
    }else {
      this.rollback(0);
    }

    this.oldRollbackPoints.push(this.rollbackPoints[this.rollbackPoints.length-1]);

    let rollbackPointsCache = this.rollbackPoints.slice(0, this.rollbackPoints.length-1);
    this.rollbackPoints = rollbackPointsCache;
  }

  rollback(id) {

    let newWorkData = this.steps.slice(0, id);
    let cacheWorkData = this.steps.slice(id, this.steps.length);
    this.steps = newWorkData;
    this.oldSteps.push(cacheWorkData);

    return true;
  }

  rolloutToNextPoint() {
    if(this.oldRollbackPoints.length == 0) {
      return;
    }

    let newPoint = this.oldRollbackPoints[this.oldRollbackPoints.length-1];
    this.rollbackPoints.push(newPoint);

    let rollbackPointsCache = this.oldRollbackPoints.slice(0, this.oldRollbackPoints.length-1);
    this.oldRollbackPoints = rollbackPointsCache;

    this.steps = this.steps.concat(this.oldSteps[this.oldSteps.length-1]);
    let cacheWorkData = this.oldSteps.slice(0, this.oldSteps.length-1);
    this.oldSteps = cacheWorkData;

  }

  rollout(id) {

  }

  /*rollbackToTime() {

  }*/
}
