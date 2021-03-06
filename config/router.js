/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
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
 *
*/


var router = new geddy.RegExpRouter();
router.match('/').to({controller: 'Main', action: 'index'});
router.match('/login').to({controller: 'Authentications', action: 'add'});
router.match('/logout').to({controller: 'Authentications', action: 'remove'});
router.match('/articles/:year/:month:/:date/:link').to({controller: 'Articles', action: 'show'});

// Basic routes
// router.match('/moving/pictures/:id').to(
//    {controller: 'Moving', action: 'pictures'});
// router.match('/farewells/:farewelltype/kings/:kingid').to(
//    {controller: 'Farewells', action: 'kings'});
// Can also match specific HTTP methods only
// router.match('/xandadu', 'get').to(
//    {controller: 'Xandadu', action: 'specialHandler'});
//
// Resource-based routes
// router.resource('hemispheres');

router.resource('articles');
router.resource('comments');
router.resource('authentications');
exports.router = router;

