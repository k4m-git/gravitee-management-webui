/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import angular = require('angular');

import 'angular-ui-router';

import './index.scss';

import './portal/portal.module';
import './management/management.module';

fetchData().then(bootstrapApplication);

function fetchData() {
  let initInjector: ng.auto.IInjectorService = angular.injector(['ng']);
  let $http: ng.IHttpService = initInjector.get('$http');
  let $q: ng.IQService = initInjector.get('$q');

  return $q.all([$http.get('constants.json'), $http.get('build.json')]).then(function (responses: any) {
    angular.module('gravitee-management').constant('Constants', responses[0].data);
    angular.module('gravitee-management').constant('Build', responses[1].data);

    angular.module('gravitee-portal').constant('Constants', responses[0].data);
    angular.module('gravitee-portal').constant('Build', responses[1].data);
    return $q.all([$http.get(`./themes/${responses[0].data.theme}-theme.json`)])
      .then((responses: any) => {
        angular.module('gravitee-portal').constant('Theme', responses[0].data);
      });
  });
}

function bootstrapApplication() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['gravitee-portal', 'gravitee-management']);
  });
}
