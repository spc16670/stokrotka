
module.exports = function Queue(Fabric,Log,Utils,Config) {

	Log.info('Initializing ' + this.constructor.name);

	var Service = { id: null, size : null, job: null, progress: null };

	Service.add = function(model) {
		if ( this.job == null ) {
			Service.job = model;
			Log.info("Job added",model.uid);
			Service.start();
		} else {
			Log.info("Job already queued",Service.job.uid);	
		}
	}


	Service.start = function() {
		Service.id = new Date().getTime();
		Log.info("----------------- Started:",Service.id,Service.job.uid);
		Service.size = Service.job.sizes[Service.job.sizeIndex].canvasSize;

		for (var i=0;i<Service.job.fabrics.length;i++) {
			var f = Service.job.fabrics[i];

			// TAG OBJECTS AND ADD PROGRESS
			var objCount = f.fabricJson.objects.length;	
			for (var j=0;j<objCount;j++) {
	
				f.fabricJson.objects[j].materialIndex = f.materialIndex;
				if (f.fabricJson.objects[j].type == "image") {
					var src = f.fabricJson.objects[j].src;
					var httpSrc = src.replace("https:\/\/46.101.82.223:7443","http:\/\/46.101.82.223:7000");
					f.fabricJson.objects[j].src = httpSrc;
				}
			};
		}

		var start = 0;
		var total = Service.job.fabrics.length;	   
		Service.progress = { total : total, current : start };
		
		Fabric.convert(Service.id, start, Service.job.fabrics[start], Service.size, Service.next);	

	}

	Service.next = function (result) {
		Service.progress.current++;
		Log.info("Progressing: ",result,Service.progress.current,"/",Service.progress.total);
		if (Service.progress.current == Service.progress.total) {
			Service.end();
			return;
		}
		if (result == "ok") {
			Log.info("Move onto next fabric");
			Fabric.convert(
				Service.id
				,Service.progress.current
				, Service.job.fabrics[Service.progress.current]
				, Service.size
				, Service.next
			);		
		} else {
			Log.info("Processing failed");
		}
	}


	Service.end = function() {
		Log.info("Job finished");
		Service.id = null;
		Service.job = null;
		Service.progress = null;
		return { result : "ok" };
	}

	return Service;
}

