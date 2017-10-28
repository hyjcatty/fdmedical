Please install the Node.js v5.1.0 or higher (higher than 6.0 is not recommended).
IF your environment have not install the gulp & webpack, u neek install them first:
npm install gulp -g
npm install -g node-gyp
npm install --global --production windows-build-tools

pay attention: these command may need administrator power.

Then add your npm node path into System PATH, and keep command "gulp" & "webpack" can run everywhere.

Change your work DIR to source folder.
Keep your internet link fluent, or you can use the set the npm mirror in your country.
1) Prepare the environment for node_modules, command:
npm install --save-dev

You may face some compile error under windows for MOSCA, it will be OK if your windows-build-tools install correctly.

2) copy the useful resource to the deliver folder, command:
gulp

before gulp, u can open the gulpfile.js as a text file, can modify some replace marco information.



U can get the output in fold /dist.

Directory structure:
----+-build         // save the js & resource file after they are built
    +-resource      // 3rd resource folder, main content is font-awesome
    +-dist          // save the final deliver files
    +-node_modules  // Node.js plugin folder, all dependence will be save in it after npm install
    +-src           // source folder
    +-svg           // svg icon folder
    --gulpfile.js   // gulp command configuration
    --index.html    // entry of the UI, will be compiled
    --package.json  // npm configuration file
    --readme.txt    // help file
    --product_description.txt    // Production discription
    --request.php   // php entry for Apache&PHP environment
    --webpack.config.js //webpack react hot server configuration file
    --webpack.build.config.js //webpack build configuration file


.

before u open the web, go to the !src code! folder,run these command in 2 different command windows:
node mqttserver.js
node mqttclient.js

the server must be launched before client, and your sever's 1883/3000 port should be free.
