/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.15705128205128, "KoPercent": 1.8429487179487178};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8064516129032258, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3627450980392157, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/01dea270-0bd0-4727-9457-ae52498ef0e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0d3cde6-fdc0-42ff-aadb-77f8d599aa6c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/651105b7-cc90-4719-b957-d7c14c33f4ae"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/917bbb75-71c9-43f6-be5e-9ebfb7574ccf"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fa73a45-9634-4c79-ad5f-949ef0217fe4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15b41092-2db0-44ff-ad8f-cb51f03585ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a30d15ef-c696-4281-b42a-5fc73d6d4d99"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=965e2c15-a9a9-4900-96a7-cb20cff9c758"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c825ca9-d737-4d0c-ab25-c343259089ea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b5ebf79-a807-47cd-9900-ef9ca3b26408"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbfa9b61-870f-46b1-9191-9662dd5f28f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56132aed-9b1b-4e2f-acf7-fd011f278980"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f73db8e-1514-429d-a235-1ff10d6c0ebc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c72129cf-746f-4be5-97bf-5c1b2ae9ac84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3aa75fa9-d1db-47bd-a9df-d19e3858338d"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b0c0dbb-2564-485e-8b92-870e8038ac83"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0d3cde6-fdc0-42ff-aadb-77f8d599aa6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4fa73a45-9634-4c79-ad5f-949ef0217fe4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49019607843137253, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=917bbb75-71c9-43f6-be5e-9ebfb7574ccf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b5ebf79-a807-47cd-9900-ef9ca3b26408"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15b41092-2db0-44ff-ad8f-cb51f03585ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a30d15ef-c696-4281-b42a-5fc73d6d4d99"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7843137254901961, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181286549707602, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/965e2c15-a9a9-4900-96a7-cb20cff9c758"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c825ca9-d737-4d0c-ab25-c343259089ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5bb6890-039c-4052-9f57-8c08d0ab6a5b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f73db8e-1514-429d-a235-1ff10d6c0ebc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b0c0dbb-2564-485e-8b92-870e8038ac83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72129cf-746f-4be5-97bf-5c1b2ae9ac84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbfa9b61-870f-46b1-9191-9662dd5f28f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1248, 23, 1.8429487179487178, 308.64583333333275, 1, 3077, 92.5, 859.1000000000001, 1043.1499999999994, 1556.6299999999999, 4.831086181467675, 670.0305444988329, 3.5130120327143506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 1, 1.9607843137254901, 1371.6078431372543, 953, 1833, 1403.0, 1657.0, 1697.2, 1833.0, 0.22832685661073407, 274.7624157275232, 1.1200450134086066], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/01dea270-0bd0-4727-9457-ae52498ef0e0", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.6323483910891089, 1.1815439356435644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0d3cde6-fdc0-42ff-aadb-77f8d599aa6c", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 610.7857142857142, 82, 1473, 563.0, 1254.5, 1473.0, 1473.0, 0.0835147791332359, 0.015769706132370925, 0.05647850053688073], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 610.7857142857142, 82, 1473, 563.0, 1254.5, 1473.0, 1473.0, 0.08206186292151954, 0.015495358742226103, 0.05549593757143778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 107.82352941176471, 78, 241, 80.0, 239.4, 241.0, 241.0, 0.09352221152523725, 0.0498126117452895, 0.051950814881034243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 81.05882352941177, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.09352169703371183, 0.06950196429946748, 0.046943508081374874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 246.64705882352936, 78, 634, 233.0, 630.8, 634.0, 634.0, 0.09352272602242344, 6.489578920802755, 0.05318138010661591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 239.1764705882353, 77, 934, 81.0, 930.8, 934.0, 934.0, 0.09352272602242344, 14.8710965866268, 0.053562820452870044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/651105b7-cc90-4719-b957-d7c14c33f4ae", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/917bbb75-71c9-43f6-be5e-9ebfb7574ccf", 3, 0, 0.0, 437.3333333333333, 197, 591, 524.0, 591.0, 591.0, 591.0, 0.0410430404684379, 0.02638672035324377, 0.02631991852956467], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 230.9375, 79, 565, 182.5, 442.5000000000001, 565.0, 565.0, 0.09119407238529495, 0.16055811840980339, 0.05894441080079795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fa73a45-9634-4c79-ad5f-949ef0217fe4", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 81.2, 79, 88, 81.0, 83.9, 87.8, 88.0, 0.09755098258227206, 0.07249638451670805, 0.04896602055399203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 79.69999999999999, 77, 82, 79.0, 82.0, 82.0, 82.0, 0.09755193421097558, 0.026102763646296195, 0.055635087479697004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 584.25, 470, 629, 619.0, 629.0, 629.0, 629.0, 0.041803835501907305, 12.291715655536395, 0.023841249934681508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 820.0, 772, 940, 784.0, 940.0, 940.0, 940.0, 0.04173971116119877, 37.55746547343268, 0.023763917584940314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 158.25, 81, 236, 158.0, 236.0, 236.0, 236.0, 0.04197491998530878, 0.07427593263025342, 0.02324197229655281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 92.35714285714286, 79, 235, 81.0, 162.0, 235.0, 235.0, 0.06786431015928723, 0.05043431643673592, 0.034064702560423474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 113.5, 78, 237, 80.0, 236.5, 237.0, 237.0, 0.06781401521940256, 0.025420795046670573, 0.03826837214878395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 178.14285714285714, 77, 699, 81.0, 509.0, 699.0, 699.0, 0.06786595504365235, 4.378835827710154, 0.03948117083315155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 179.07142857142856, 78, 692, 81.0, 466.0, 692.0, 692.0, 0.06781467218871855, 1.44124153830318, 0.03951756218363245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15b41092-2db0-44ff-ad8f-cb51f03585ef", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.25, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.04204242080258981, 0.031244416240987158, 0.02360780464989174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a30d15ef-c696-4281-b42a-5fc73d6d4d99", 3, 0, 0.0, 508.0, 167, 1000, 357.0, 1000.0, 1000.0, 1000.0, 0.036300715124087946, 0.030262412575777744, 0.02327877890444442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 635.1999999999999, 79, 1227, 782.0, 1058.4, 1227.0, 1227.0, 0.1146412112226103, 68.77987538022668, 0.06082850725678868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 88.25, 79, 237, 80.0, 82.9, 229.2999999999999, 237.0, 0.097551458394303, 0.026293166520339476, 0.057349587845088285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 457.8666666666666, 78, 768, 627.0, 730.2, 768.0, 768.0, 0.11464997363050605, 22.484233240084688, 0.060945119446164195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 111.7, 77, 239, 81.0, 238.0, 238.95, 239.0, 0.09755288585824591, 0.02629355126648034, 0.05744569352785379], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 437.0, 134, 598, 439.0, 596.8, 598.0, 598.0, 0.08167111669546098, 0.015472848280194754, 0.0558605406784985], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 305.28571428571433, 162, 779, 316.5, 624.5, 779.0, 779.0, 0.06778709043282057, 5.890190322848123, 0.15121590067254478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=965e2c15-a9a9-4900-96a7-cb20cff9c758", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 497.23809523809524, 93, 963, 503.0, 884.6, 956.3, 963.0, 0.09804287741839098, 0.06022360341422649, 0.04432993383272951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.19999999999999, 79, 99, 81.0, 90.0, 99.0, 99.0, 0.1146464685066151, 0.08520113528665439, 0.057547153137109536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 150.6, 79, 325, 82.0, 277.6, 325.0, 325.0, 0.11463770663446621, 0.145461517077197, 0.05896079963621634], "isController": false}, {"data": ["login", 21, 0, 0.0, 2481.9523809523803, 1597, 4448, 2355.0, 3323.4, 4335.999999999998, 4448.0, 0.0944261587438623, 21.648716211734925, 0.17229348914773648], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 93.35000000000001, 80, 242, 84.0, 97.60000000000001, 234.7999999999999, 242.0, 0.1001963849144323, 0.08111601864654723, 0.0356166837000521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c825ca9-d737-4d0c-ab25-c343259089ea", 3, 0, 0.0, 520.6666666666666, 244, 1032, 286.0, 1032.0, 1032.0, 1032.0, 0.029974821150233803, 0.02498877505395468, 0.019222134656888212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b5ebf79-a807-47cd-9900-ef9ca3b26408", 3, 0, 0.0, 410.3333333333333, 178, 565, 488.0, 565.0, 565.0, 565.0, 0.028785814350687982, 0.02399754900784893, 0.018459653082960718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbfa9b61-870f-46b1-9191-9662dd5f28f6", 3, 0, 0.0, 471.33333333333337, 301, 791, 322.0, 791.0, 791.0, 791.0, 0.043562861208724185, 0.02800672229402027, 0.02793581919960503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56132aed-9b1b-4e2f-acf7-fd011f278980", 2, 0, 0.0, 292.0, 162, 422, 292.0, 422.0, 422.0, 422.0, 0.02340604812283494, 0.026423234013669136, 0.014548778935726992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 718.8666666666667, 161, 1311, 866.0, 1141.8000000000002, 1311.0, 1311.0, 0.11456590976788947, 91.43295668597102, 0.23811957482681453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f73db8e-1514-429d-a235-1ff10d6c0ebc", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c72129cf-746f-4be5-97bf-5c1b2ae9ac84", 3, 0, 0.0, 377.6666666666667, 209, 534, 390.0, 534.0, 534.0, 534.0, 0.035661642337501784, 0.02292699987518425, 0.02286895683752556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3aa75fa9-d1db-47bd-a9df-d19e3858338d", 2, 0, 0.0, 192.0, 177, 207, 192.0, 207.0, 207.0, 207.0, 0.019667810677654416, 0.02237597601510488, 0.012225157711256871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 400.1764705882353, 163, 1016, 318.0, 1010.4, 1016.0, 1016.0, 0.09347952798337164, 21.470069539145925, 0.2055443412580145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 548.8571428571429, 79, 1020, 852.0, 1020.0, 1020.0, 1020.0, 0.05595344673231871, 38.25771645490951, 0.08784878481103722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b0c0dbb-2564-485e-8b92-870e8038ac83", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1197.5238095238094, 168, 2005, 1079.0, 1922.8, 1996.8, 2005.0, 0.09686346863468635, 0.030756313422509222, 0.04370207276291513], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 202.24999999999997, 160, 320, 164.5, 319.9, 320.0, 320.0, 0.0975124572164094, 0.1511252632836345, 0.21930780172792075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 86.76470588235294, 81, 128, 83.0, 98.39999999999998, 128.0, 128.0, 0.10625066406665042, 0.0824895292314327, 0.03776879074244214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 467.50000000000006, 160, 1145, 320.0, 1123.5, 1145.0, 1145.0, 0.10816239811488391, 27.860245067504923, 0.23732954764939931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0d3cde6-fdc0-42ff-aadb-77f8d599aa6c", 3, 0, 0.0, 307.0, 183, 381, 357.0, 381.0, 381.0, 381.0, 0.04930075101477379, 0.03169563256971948, 0.031615390461948036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 102.42857142857143, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.03988285834748225, 0.029639507033626944, 0.020019325381451052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fa73a45-9634-4c79-ad5f-949ef0217fe4", 3, 0, 0.0, 687.3333333333333, 188, 1623, 251.0, 1623.0, 1623.0, 1623.0, 0.02552604933334468, 0.030170926148884936, 0.01636924387587533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 102.85714285714286, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.03984766805754003, 0.010662364304458953, 0.022725623189065798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 123.71428571428572, 78, 237, 79.0, 237.0, 237.0, 237.0, 0.03984789489263839, 0.01074025292028144, 0.02342620383336749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 101.57142857142857, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.03988331282191531, 0.010749799159031861, 0.023485974249623957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 2.200909514925373, 4.613164645522388], "isController": false}, {"data": ["https://demoqa.com/books", 51, 1, 1.9607843137254901, 951.2549019607843, 625, 1419, 924.0, 1245.4000000000003, 1335.4, 1419.0, 0.2317223330349719, 275.8930583329736, 0.4552759923736091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1197.5238095238094, 168, 2005, 1079.0, 1922.8, 1996.8, 2005.0, 0.09473199866472992, 0.030079524129593374, 0.04274041346006369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.42857142857143, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.03272236012359703, 0.008819698627063262, 0.019269124174344735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 125.28571428571428, 78, 239, 81.0, 239.0, 239.0, 239.0, 0.03272220715961893, 0.008819657398491039, 0.019237078818447845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=917bbb75-71c9-43f6-be5e-9ebfb7574ccf", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 98.29411764705883, 79, 235, 80.0, 234.2, 235.0, 235.0, 0.10757995722114641, 0.02899616034476212, 0.06324524828821304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 98.70588235294117, 78, 239, 81.0, 235.8, 239.0, 239.0, 0.10747114083776915, 0.02896683092892997, 0.06328622844255352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 102.28571428571429, 79, 239, 80.0, 239.0, 239.0, 239.0, 0.03272251308900524, 0.00875582869764398, 0.0186620582460733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 99.58823529411765, 79, 240, 81.0, 235.2, 240.0, 240.0, 0.1075792764344431, 0.07994905211583124, 0.05399975399150757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 82.71428571428571, 80, 90, 82.0, 90.0, 90.0, 90.0, 0.03272220715961893, 0.024317968406708988, 0.016425014140668093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.76470588235293, 79, 240, 80.0, 239.2, 240.0, 240.0, 0.10747114083776915, 0.0287569263569812, 0.061292135009040224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.0, 82, 239, 88.0, 239.0, 239.0, 239.0, 0.03256283464127386, 0.025630512422721418, 0.011575070126390316], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 614.8461538461537, 80, 1623, 534.0, 1386.6, 1623.0, 1623.0, 0.08242507243895789, 0.015442317507719426, 0.05609759287086528], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b5ebf79-a807-47cd-9900-ef9ca3b26408", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1510.0952380952383, 951, 3077, 1352.0, 2448.8, 3017.2999999999993, 3077.0, 0.09487923229146901, 0.04910741515085798, 0.043640740634064354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 209.28571428571428, 160, 325, 165.0, 325.0, 325.0, 325.0, 0.03270966897814994, 0.05069359830891012, 0.07356481216472589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15b41092-2db0-44ff-ad8f-cb51f03585ef", 3, 0, 0.0, 272.3333333333333, 172, 386, 259.0, 386.0, 386.0, 386.0, 0.037689862683266954, 0.03063528226566328, 0.02416960595248565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a30d15ef-c696-4281-b42a-5fc73d6d4d99", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 904.9333333333336, 406, 2764, 705.5, 1479.2, 1595.1, 2764.0, 0.2797502762533978, 95.92476243810525, 1.0143724982748732], "isController": true}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 156.72549019607843, 79, 332, 83.0, 322.0, 324.4, 332.0, 0.23229967569143317, 0.17263677070427794, 0.11229330026099552], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 1, 1.9607843137254901, 510.4509803921568, 1, 756, 471.0, 682.2000000000003, 719.0, 756.0, 0.2321917995319742, 66.94199754235224, 0.11448642076341022], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 122.9607843137255, 79, 249, 83.0, 238.60000000000002, 240.8, 249.0, 0.23260056553862993, 0.41159396948827875, 0.11312019691234151], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 792.9215686274512, 545, 1094, 782.0, 940.8, 1044.0, 1094.0, 0.23210937357776118, 208.85242235002778, 0.11650802540914966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 85.07142857142856, 82, 90, 84.5, 89.5, 90.0, 90.0, 0.1066975581501692, 0.07971057811023383, 0.03792764762369296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, 7.017543859649122, 154.7368421052631, 79, 1445, 85.0, 299.20000000000016, 406.8000000000002, 1185.8000000000004, 0.7243092588749063, 1.5203073641814246, 0.35102343759927485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 84.57142857142857, 82, 92, 83.0, 92.0, 92.0, 92.0, 0.039134348217430434, 0.030306189586349938, 0.013911037842914725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 86.3529411764706, 81, 106, 83.0, 102.8, 106.0, 106.0, 0.08831260584525553, 0.07166774947012437, 0.03139237160905568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 228.28571428571428, 159, 474, 162.0, 474.0, 474.0, 474.0, 0.03982907636371913, 0.061727289247287355, 0.08957652623598159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 218.05882352941177, 159, 479, 164.0, 471.8, 479.0, 479.0, 0.10741613643113046, 0.1664740317541055, 0.24158140839931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/965e2c15-a9a9-4900-96a7-cb20cff9c758", 3, 0, 0.0, 355.33333333333337, 174, 662, 230.0, 662.0, 662.0, 662.0, 0.02765843674515516, 0.027919535269116592, 0.01773669283462099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 99.57142857142857, 81, 239, 84.0, 184.0, 239.0, 239.0, 0.06669461488623804, 0.05529660941251572, 0.02370785138534243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c825ca9-d737-4d0c-ab25-c343259089ea", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5bb6890-039c-4052-9f57-8c08d0ab6a5b", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f73db8e-1514-429d-a235-1ff10d6c0ebc", 3, 0, 0.0, 551.6666666666666, 175, 1093, 387.0, 1093.0, 1093.0, 1093.0, 0.029132153157439868, 0.029217501262393305, 0.018681751862030124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 86.93333333333334, 81, 106, 84.0, 99.4, 106.0, 106.0, 0.1145930419104952, 0.08896627765512079, 0.04073424536662134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b0c0dbb-2564-485e-8b92-870e8038ac83", 3, 0, 0.0, 353.66666666666663, 175, 681, 205.0, 681.0, 681.0, 681.0, 0.03699501800424209, 0.03084122431929167, 0.023724018707147437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72129cf-746f-4be5-97bf-5c1b2ae9ac84", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbfa9b61-870f-46b1-9191-9662dd5f28f6", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 114.57142857142857, 78, 240, 81.5, 239.0, 240.0, 240.0, 0.10836081053886283, 0.0805298601758541, 0.05439204747751513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 147.42857142857142, 79, 245, 81.0, 242.5, 245.0, 245.0, 0.10836081053886283, 0.06387059493955015, 0.05984939298595953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 307.00000000000006, 79, 1021, 158.0, 962.5, 1021.0, 1021.0, 0.10823012817539465, 20.891276011468527, 0.06163440055970437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 242.78571428571428, 77, 638, 236.0, 631.0, 638.0, 638.0, 0.10823012817539465, 6.842188514657451, 0.061740094044250654], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 17.391304347826086, 0.32051282051282054], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 4.3478260869565215, 0.08012820512820513], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.16025641025641027], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.08012820512820513], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.1217948717948718], "isController": false}, {"data": ["Assertion failed", 1, 4.3478260869565215, 0.08012820512820513], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1248, 23, "401/Unauthorized", 14, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 51, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
