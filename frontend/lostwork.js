
ACER@DESKTOP-6FEKBIO MINGW64 ~/Desktop/gulshanBackend (BackendWork)
$ git reflog --oneline
2f891bb (HEAD -> BackendWork, origin/BackendWork) HEAD@{0}: commit: Ready for deployment
97db91a HEAD@{1}: reset: moving to HEAD~1
30a1fc8 HEAD@{2}: commit: ready to deploy
97db91a HEAD@{3}: commit: apply some changes to make app deployment ready
a534a4f HEAD@{4}: reset: moving to HEAD~2
fe0c095 HEAD@{5}: commit: add package.json file
ea34aa7 HEAD@{6}: commit: make modifications to make app production ready
a534a4f HEAD@{7}: commit: Prepare expense tracker app for deployment
2c3a857 HEAD@{8}: commit: send number of rows of expenses to the user as per user's input
d47c037 HEAD@{9}: commit: Display monthly expenses through pagination to premium users

ACER@DESKTOP-6FEKBIO MINGW64 ~/Desktop/gulshanBackend (BackendWork)
$ git diff HEAD@{1} HEAD
diff --git a/ET/backend/app.js b/ET/backend/app.js
index 8460656..7a89cd9 100644
--- a/ET/backend/app.js
+++ b/ET/backend/app.js
@@ -55,6 +55,7 @@ const { Order } = require('./models/order.models.js');
 const { User } = require('./models/user.models.js');
 const { Expense } = require('./models/expense.models.js');
 const {forgotPasswordRequests} = require('./models/ForgotPasswordRequests.js');
+const {listOfDownloadedExpenses} = require('./models/url.models.js');

 User.hasMany(Expense);
 Expense.belongsTo(User);
@@ -66,8 +67,13 @@ Order.belongsTo(User);
 User.hasMany(forgotPasswordRequests);
 forgotPasswordRequests.belongsTo(User);

+User.hasMany(listOfDownloadedExpenses);
+listOfDownloadedExpenses.belongsTo(User);
+
+
 const sequelize = require('./utils/database.js');

+
 sequelize.sync().then((result)=>{
     app.listen(PORT, '0.0.0.0', ()=>{
         console.log('Server Started at port', PORT);
diff --git a/ET/backend/controllers/expense.controllers.js b/ET/backend/controllers/expense.controllers.js
index 3017b67..d75c244 100644
--- a/ET/backend/controllers/expense.controllers.js
+++ b/ET/backend/controllers/expense.controllers.js
@@ -101,8 +101,6 @@ const deleteExpense = async (req, res, next) =>{
     }
 }

-
-
 module.exports = {
     addExpense,
     getExpenses,
diff --git a/ET/backend/controllers/passwordRequests.controllers.js b/ET/backend/controllers/passwordRequests.controllers.js
index 9ecc223..3cedb82 100644
--- a/ET/backend/controllers/passwordRequests.controllers.js
+++ b/ET/backend/controllers/passwordRequests.controllers.js
@@ -111,6 +111,7 @@ const setNewPassword = async (req, res, next) =>{
     }
 }

+
 module.exports = {
     forgotPassword,
     checkResetPasswordRequest,
diff --git a/ET/backend/controllers/premiumuser.controllers.js b/ET/backend/controllers/premiumuser.controllers.js
index ebfb6af..5d4a260 100644
--- a/ET/backend/controllers/premiumuser.controllers.js
+++ b/ET/backend/controllers/premiumuser.controllers.js
@@ -72,5 +72,4 @@ module.exports = {
     checkPremiumUser,
     userExpenses,
     getExpensesReport
-};
-
+};
\ No newline at end of file
diff --git a/ET/backend/controllers/purchase.controllers.js b/ET/backend/controllers/purchase.controllers.js
index 8e2a019..94d010d 100644
--- a/ET/backend/controllers/purchase.controllers.js
+++ b/ET/backend/controllers/purchase.controllers.js
@@ -89,6 +89,7 @@ const getPremiumToken = (req, res, next) =>{
 }


+
 module.exports = {
     purchasePremium,
     updatetransactionStatus,
diff --git a/ET/backend/controllers/sendInBlue.js b/ET/backend/controllers/sendInBlue.js
index 8818547..7a787dc 100644
--- a/ET/backend/controllers/sendInBlue.js
+++ b/ET/backend/controllers/sendInBlue.js
@@ -30,6 +30,8 @@ function sendPasswordResetMail (email, id){
    }
 };

+
+
 module.exports = {
     sendPasswordResetMail
 };
\ No newline at end of file
diff --git a/ET/backend/controllers/user.controllers.js b/ET/backend/controllers/user.controllers.js
index cca5849..6620385 100644
--- a/ET/backend/controllers/user.controllers.js
+++ b/ET/backend/controllers/user.controllers.js
@@ -115,4 +115,4 @@ module.exports = {
   getUser,
   encryptPassword,
   decryptPassword
-};
+};
\ No newline at end of file
diff --git a/ET/backend/middlewares/auth.js b/ET/backend/middlewares/auth.js
index 1027507..19f9a41 100644
--- a/ET/backend/middlewares/auth.js
+++ b/ET/backend/middlewares/auth.js
@@ -35,6 +35,7 @@ const verifyToken = async (req, res, next) =>{
     }
 }

+
 module.exports = {
     verifyToken
 }
\ No newline at end of file
diff --git a/ET/backend/models/ForgotPasswordRequests.js b/ET/backend/models/ForgotPasswordRequests.js
index 7279475..20a1d48 100644
--- a/ET/backend/models/ForgotPasswordRequests.js
+++ b/ET/backend/models/ForgotPasswordRequests.js
@@ -15,6 +15,7 @@ const forgotPasswordRequests = sequelize.define('forgotPasswordRequest', {
 });


+
 module.exports = {
     forgotPasswordRequests
 };
\ No newline at end of file
diff --git a/ET/backend/models/expense.models.js b/ET/backend/models/expense.models.js
index cb1a773..11f0be5 100644
--- a/ET/backend/models/expense.models.js
+++ b/ET/backend/models/expense.models.js
@@ -2,6 +2,7 @@ const {DataTypes} = require('sequelize');

 const sequelize = require('../utils/database.js');

+
 const Expense = sequelize.define('expense',{
     id:{
         type : DataTypes.INTEGER,
diff --git a/ET/backend/models/order.models.js b/ET/backend/models/order.models.js
index 181afbe..4f56e91 100644
--- a/ET/backend/models/order.models.js
+++ b/ET/backend/models/order.models.js
@@ -23,4 +23,5 @@ const Order = sequelize.define('order',{
 }
 )

+
 module.exports = {Order};
\ No newline at end of file
diff --git a/ET/backend/models/url.models.js b/ET/backend/models/url.models.js
index c85b868..35ba1d2 100644
--- a/ET/backend/models/url.models.js
+++ b/ET/backend/models/url.models.js
@@ -15,4 +15,5 @@ const listOfDownloadedExpenses = sequelize.define('downloadedexpenseslist',{
 }
 )

+
 module.exports = {listOfDownloadedExpenses};
\ No newline at end of file
diff --git a/ET/backend/models/user.models.js b/ET/backend/models/user.models.js
index 4e71969..33e5fc7 100644
--- a/ET/backend/models/user.models.js
+++ b/ET/backend/models/user.models.js
@@ -32,4 +32,5 @@ const User = sequelize.define('user',{
 }
 )

+
 module.exports = {User};
\ No newline at end of file
diff --git a/ET/backend/public/resetPassword.html b/ET/backend/public/resetPassword.html
index 61bb79e..c78a4cc 100644
--- a/ET/backend/public/resetPassword.html
+++ b/ET/backend/public/resetPassword.html
@@ -19,4 +19,4 @@
     const form = document.querySelector('form');
     form.action = action;
 </script>
-</html>
\ No newline at end of file
+</html>
diff --git a/ET/backend/services/authentication.services.js b/ET/backend/services/authentication.services.js
index c3eb3c7..00147e3 100644
--- a/ET/backend/services/authentication.services.js
+++ b/ET/backend/services/authentication.services.js
@@ -29,6 +29,7 @@ async function generateToken(payload){
   }
 }

+
 module.exports = {
     encryptPassword,
     decryptPassword,
diff --git a/ET/backend/services/aws.services.js b/ET/backend/services/aws.services.js
index 1707f6c..a37863d 100644
--- a/ET/backend/services/aws.services.js
+++ b/ET/backend/services/aws.services.js
@@ -32,7 +32,6 @@ async function uploadToS3(data, filename, Bucket= 'appexpensetracker'){

 }

-
 module.exports = {
     uploadToS3
 }
\ No newline at end of file
diff --git a/ET/backend/services/databaseservices/expense.services.js b/ET/backend/services/databaseservices/expense.services.js
index e285a14..02e2c2d 100644
--- a/ET/backend/services/databaseservices/expense.services.js
+++ b/ET/backend/services/databaseservices/expense.services.js
@@ -87,7 +87,6 @@ async function deleteExpenseFromDatabase (user, expenseId) {
     }
 };

-
 // get limited user's expenses with request value
 async function getDataForPagination(userId, pageNumber, items_per_page){
     try {
diff --git a/ET/backend/services/databaseservices/request.services.js b/ET/backend/services/databaseservices/request.services.js
index 3637c35..33ab975 100644
--- a/ET/backend/services/databaseservices/request.services.js
+++ b/ET/backend/services/databaseservices/request.services.js
@@ -35,6 +35,7 @@ async function findActiveForgotPasswordRequest(requestId) {
     }
 }

+
 module.exports = {
     createForgotPasswordRequests,
     findActiveForgotPasswordRequest
diff --git a/ET/backend/services/databaseservices/url.services.js b/ET/backend/services/databaseservices/url.services.js
index 04df583..f97dbf0 100644
--- a/ET/backend/services/databaseservices/url.services.js
+++ b/ET/backend/services/databaseservices/url.services.js
@@ -26,6 +26,7 @@ async function getDownloadedFileUrlList(user){
     }
 }

+
 module.exports = {
     saveDownloadedFileUrl,
     getDownloadedFileUrlList
diff --git a/ET/backend/services/databaseservices/user.services.js b/ET/backend/services/databaseservices/user.services.js
index 0166487..693402a 100644
--- a/ET/backend/services/databaseservices/user.services.js
+++ b/ET/backend/services/databaseservices/user.services.js
@@ -57,6 +57,7 @@ async function updateUser(userId, userDetails) {
 }


+
 module.exports = {
     getUserFromDatabase,
     getAllUsersFromDatabase,
diff --git a/ET/backend/services/email.services.js b/ET/backend/services/email.services.js
index b8c49ad..9525530 100644
--- a/ET/backend/services/email.services.js
+++ b/ET/backend/services/email.services.js
@@ -20,6 +20,7 @@ function sendPasswordResetMail (email, id){
          email : email
      }];

+     
      return transEmailApi.sendTransacEmail({
          sender,
          to: receivers,
diff --git a/ET/backend/utils/database.js b/ET/backend/utils/database.js
index c0f0be5..a88b2fc 100644
--- a/ET/backend/utils/database.js
+++ b/ET/backend/utils/database.js
@@ -1,7 +1,7 @@
@@ -1,7 +1,7 @@
 const Sequelize = require('sequelize');

-const sequelize = new Sequelize('expense_tracker', process.env.DB_USERNAME, process.env.DB_PASSWORD , {
+const sequelize = new Sequelize('expense_tracker' , process.env.DB_USERNAME, process.env.DB_PASSWORD , {
     dialect : 'mysql'
 });

-module.exports = sequelize;
\ No newline at end of file
