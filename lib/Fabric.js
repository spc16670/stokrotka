
module.exports = function Fabric(Log,Utils,Config) {

	Log.info('Initializing ' + this.constructor.name);

	var fabric = require('fabric').fabric;
	var fs     = require('fs');
	var sys    = require('sys');

	var Service = { 
		progress : {}
		, cb : null
		, file : { path : null, name : null }
		, canvas : fabric.createCanvasForNode(50,50) 
	};

	Service.convert = function(id,sideIndex,f,size,cb) {
   
		Log.info(id,sideIndex,f,size);
 
		var result = "ok";
		Service.file.path = Config.CONVERTED_PATH + '/' + id + '/'
		Utils.createPath(Service.file.path);
    
		Service.cb = cb;
		Service.file.name = f.materialIndex + '.png'; 

		Log.info('Converting side: ' + sideIndex + ' started');

		var key = f.materialIndex.toString();

		Service.progress = { 
			total : f.fabricJson.objects.length
			, soFar : 0
		};
	
		Service.canvas.setWidth(size.x);
		Service.canvas.setHeight(size.y);
		

		//Log.info("f.fabricJson",f.fabricJson);
	
		Service.canvas.loadFromJSON(
			f.fabricJson
			,Service.finish
			,function(o,object) {
				Service.manage();
			}
		);

		return result;
	};


	Service.finish = function() {
		Log.info("FINISH ?????" );
		//Service.canvas.renderAll();
		Service.save();
	}

        Service.manage = function() {
		Service.progress.soFar++;
		var soFar = Service.progress.soFar;
		var total = Service.progress.total;
		Log.info("Rendered " + soFar + "/" + total );
		if (soFar == total) {
			Log.info("Side  ready..",soFar,total);
		};
	};

	Service.save = function() {
		Service.canvas.renderAll.bind(Service.canvas);
		var fullPath = Service.file.path + Service.file.name;
		Log.info("Saving ..." + fullPath);
	
		/*	
		var img = Service.canvas.getContext('2d').canvas.toDataURL();
      		var data = img.replace(/^data:image\/\w+;base64,/, "");
      		var buf = new Buffer(data, 'base64');
      		fs.writeFileSync(fullPath, buf, { encoding: 'base64', mode : 0777  });
      		Log.info('Converting side: ' + Service.file.name + ' finished');
		Service.dispose();
		*/
		
			
		var outFile = fs.createWriteStream(fullPath);	
		Service.canvas.createPNGStream().on('data', function(chunk) {
			outFile.write(chunk);
		}).on('end', function () {
			Log.info('Converting side: ' + Service.file.name + ' finished');
			Service.dispose();	
		});
		
		
		
	};


	Service.dispose = function() {
		Log.info("Disposing");
		Service.canvas.clear();
		//Service.canvas.dispose();
		Service.progress = {};
		Service.file = {};
		global.gc();
		Service.cb("ok");
	};

	return Service;
}

