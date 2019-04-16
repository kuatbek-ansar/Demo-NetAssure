import { Service } from 'typedi';

@Service()
export class AdminProtection {
  urlToContactFunctionMap = {
    'billing': 'View_Invoice'
  };

  checkAdminRoutes(req, res, next) {
    if (req.path.startsWith('/admin')) {
      const groups = req['user'].SalesforceAuth.UserGroups;
      const urlSegment = req.path.split('/')[2].toLowerCase();
      const contactFunction = this.urlToContactFunctionMap[urlSegment];

      if (contactFunction && groups.find(x => x.toLowerCase() === contactFunction.toLowerCase())) {
        next();
      } else {
        res.sendStatus(403);
      }
    } else {
      next();
    }
  }
}
