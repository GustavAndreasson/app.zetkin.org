import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import { ZetkinSurvey } from 'utils/types/zetkin';

export default class SurveyDataModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _surveyId: number;

  constructor(env: Environment, orgId: number, surveyId: number) {
    super();
    this._orgId = orgId;
    this._surveyId = surveyId;
    this._repo = new SurveysRepo(env);
  }

  getData(): IFuture<ZetkinSurvey> {
    return this._repo.getSurvey(this._orgId, this._surveyId);
  }
}
