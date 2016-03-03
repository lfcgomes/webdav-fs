(function(module) {

	"use strict";

	module.exports = {

		createStat: function(itemInfo) {
			var obj;
			obj = {
				isFile: function() {
					return itemInfo.type === "file";
				},
				isDirectory: function() {
					return itemInfo.type === "directory";
				},
				filepath: itemInfo.filename,
				basename: itemInfo.basename,
				size: itemInfo.size,
				mtime: new Date(itemInfo.lastmod)
			};
			if(itemInfo.mime) obj.mime = itemInfo.mime;
			if(itemInfo.escapedfilepath) obj.escapedfilepath = itemInfo.escapedfilepath;
			
			return obj;
		}

	};

})(module);
