const uuid = require("uuid");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const User = require("../Models/user");
const Forgotpassword = require("../Models/forgotpassword");

exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email using Mongoose
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const id = uuid.v4();

    // Create forget password request with Mongoose
    Forgotpassword.create({ active: true, userId: user._id, uuid: id })
      .then(() => {
        ForgetPassReq.findOne({ where: { userId: user.id, isActive: true } })
          .then((request) => {
            let defaultClient = SibApiV3Sdk.ApiClient.instance;
            let apiKey = defaultClient.authentications["api-key"];
            apiKey.apiKey = process.env.SIB_API_KEY;

            let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

            let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

            sendSmtpEmail.subject = "My {{params.subject}}";
            sendSmtpEmail.htmlContent =
              "<html><body><h1>Click on link to reset password {{params.parameter}}</h1></body></html>";
            sendSmtpEmail.sender = {
              name: "Amlend Jadaun",
              email: "amlendsingh@gmail.com",
            };
            sendSmtpEmail.to = [{ email: userEmail }];

            sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
            sendSmtpEmail.params = {
              parameter: `http://51.20.55.186/reset-pasword-page/${request.id}`,
              subject: "Reset Expense Tracker Password",
            };

            apiInstance.sendTransacEmail(sendSmtpEmail).then(
              function (data) {
                console.log(
                  "API called successfully. Returned data: " +
                    JSON.stringify(data)
                );
                res.status(200).json({ message: "Email sent successfully." });
              },
              function (error) {
                console.error(error);
              }
            );
          })
          .catch((err) => {
            throw new Error(err);
          });
      })
      .catch((err) => {
        // res.status(404).json({message: 'User Not Found'});
        throw new Error(err);
      })
      .catch((err) => {
        res
          .status(404)
          .json({ user: "InValied User", message: "User Not Found" });
        throw new Error(err);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetpassword = (req, res) => {
  const id = req.params.id;
  Forgotpassword.findOne({ uuid: id }).then((forgotpasswordrequest) => {
    if (forgotpasswordrequest) {
      // forgotpasswordrequest.update({ active: false});
      Forgotpassword.active = false;
      Forgotpassword.save();
      res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        } 
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`);
      res.end();
    }
  });
};

exports.updatepassword = (req, res, next) => {
  const { newpassword } = req.query;
  const { resetpasswordid } = req.params;
  Forgotpassword.findOne({ id: resetpasswordid })
    .then((resetpasswordrequest) => {
      User.findOne({ id: resetpasswordrequest.userId }).then((user) => {
        if (user) {
          // Encryption of password
          const saltRounds = 10;

          bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
            if (err) {
              console.log(err);
              throw new Error(err);
            }

            console.log(user);
            console.log(hash);

            user.update({ Password: hash }).then(() => {
              res
                .status(201)
                .json({ message: "Successfuly update the new password" });
            });
          });
        } else {
          return res
            .status(404)
            .json({ errp: "No user Exists", success: false });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
