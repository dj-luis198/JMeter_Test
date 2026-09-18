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

    var data = {"OkPercent": 98.82995319812792, "KoPercent": 1.1700468018720749};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7399866488651535, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6941ec97-779d-48cd-943f-d2b066eef681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc3f9d2a-0822-45ed-ba7e-92471643ab32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fb7d603-bfff-4e52-b9ba-8a4bb128365d"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7822eef2-5330-4b02-ae09-63dcd576d913"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b860d66-2bec-4176-a74d-32e7e8bd0df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fe51c4f-2471-436e-9b15-2986fa4b2918"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d083efe-7efd-407d-8e07-8d565a6dc5c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7822eef2-5330-4b02-ae09-63dcd576d913"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a170f500-0744-471c-a7e3-bf529d2105b5"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/189f905c-7711-498a-86e5-e73ceb423941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e122ec2-f247-4c6f-9369-582a6e171ae5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa230a66-b43f-43bb-86d5-e4ca0d2f0689"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3a6fef59-710b-4d04-843f-3ae50ecef448"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46f0c2b3-039a-4e4b-9e95-1e693f2aa7ba"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fb7d603-bfff-4e52-b9ba-8a4bb128365d"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa230a66-b43f-43bb-86d5-e4ca0d2f0689"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6941ec97-779d-48cd-943f-d2b066eef681"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1d0411b-f1b5-4d6f-9a84-960f6ccf5aac"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fe51c4f-2471-436e-9b15-2986fa4b2918"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9644970414201184, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b860d66-2bec-4176-a74d-32e7e8bd0df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e122ec2-f247-4c6f-9369-582a6e171ae5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1d0411b-f1b5-4d6f-9a84-960f6ccf5aac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f481d0f-cf19-4ed8-b6b3-0522235500f2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a170f500-0744-471c-a7e3-bf529d2105b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c1e000bd-5abc-4780-87b5-c8cd2a17f1f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46f0c2b3-039a-4e4b-9e95-1e693f2aa7ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a6fef59-710b-4d04-843f-3ae50ecef448"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=189f905c-7711-498a-86e5-e73ceb423941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc3f9d2a-0822-45ed-ba7e-92471643ab32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d083efe-7efd-407d-8e07-8d565a6dc5c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1282, 15, 1.1700468018720749, 474.4344773790954, 132, 3741, 159.5, 1336.000000000001, 1621.9499999999994, 2030.210000000001, 5.023255084968242, 715.7837736273231, 3.6663194383221076], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2348.3999999999996, 1693, 4329, 2271.0, 2730.2, 3224.3999999999983, 4329.0, 0.24816023029269368, 298.6216435271352, 1.2202019135973758], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 572.4, 148, 953, 546.0, 896.0, 953.0, 953.0, 0.08311078113052826, 0.015648201759732274, 0.0562242270004765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 572.4, 148, 953, 546.0, 896.0, 953.0, 953.0, 0.0819914073005149, 0.015437444655800072, 0.05546697351950849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6941ec97-779d-48cd-943f-d2b066eef681", 3, 0, 0.0, 792.3333333333334, 256, 1519, 602.0, 1519.0, 1519.0, 1519.0, 0.022824275899847077, 0.022891143895647413, 0.014636661302961831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 206.35294117647055, 134, 433, 141.0, 431.4, 433.0, 433.0, 0.09976116004624223, 0.026693904152998407, 0.056895036588872516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 142.23529411764704, 135, 149, 143.0, 147.4, 149.0, 149.0, 0.09993239867148694, 0.07426616737207183, 0.05016137980189871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc3f9d2a-0822-45ed-ba7e-92471643ab32", 2, 0, 0.0, 260.5, 255, 266, 260.5, 266.0, 266.0, 266.0, 0.037963630841653696, 0.033551841710641205, 0.02359751077218025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 206.8235294117647, 133, 439, 144.0, 420.59999999999997, 439.0, 439.0, 0.0999276993704555, 0.026933637720943083, 0.05884414328162565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 171.0588235294118, 134, 412, 140.0, 400.0, 412.0, 412.0, 0.09977228443317605, 0.02689174853862948, 0.058655190653097634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fb7d603-bfff-4e52-b9ba-8a4bb128365d", 3, 0, 0.0, 339.0, 233, 513, 271.0, 513.0, 513.0, 513.0, 0.030331216888421563, 0.024989684226756178, 0.01945068270514013], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 255.74999999999997, 140, 389, 246.5, 378.5, 389.0, 389.0, 0.08413303536216643, 0.15904347968975943, 0.054380422637044824], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 178.25, 135, 432, 143.5, 428.5, 432.0, 432.0, 0.09320858917149216, 0.06926927378857962, 0.04678634261147165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 192.5625, 134, 431, 141.0, 424.7, 431.0, 431.0, 0.09306275337788714, 0.051109537041884055, 0.05160938581490982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 970.6, 741, 1139, 1025.0, 1139.0, 1139.0, 1139.0, 0.07321394579239454, 21.52733099475788, 0.041754828459725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1289.2, 955, 1645, 1257.0, 1645.0, 1645.0, 1645.0, 0.07234738319514984, 65.09830257213034, 0.04118996523708237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7822eef2-5330-4b02-ae09-63dcd576d913", 3, 0, 0.0, 475.66666666666663, 235, 947, 245.0, 947.0, 947.0, 947.0, 0.019789831984326454, 0.023390911437203565, 0.012690745120157264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 253.2, 136, 438, 147.0, 438.0, 438.0, 438.0, 0.07395683878888282, 0.1308689373881403, 0.040950710540328665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 159.52941176470588, 138, 418, 143.0, 203.5999999999998, 418.0, 418.0, 0.09891887488507954, 0.07351295291752494, 0.04965263837004969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 139.82352941176467, 133, 145, 140.0, 144.2, 145.0, 145.0, 0.09892347977887693, 0.026469759237707304, 0.05641729706139075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 174.94117647058823, 135, 429, 144.0, 421.8, 429.0, 429.0, 0.09876256317899262, 0.026619597106837856, 0.05806158499389996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 213.35294117647058, 133, 562, 143.0, 448.3999999999999, 562.0, 562.0, 0.09877346596092056, 0.026622535747279373, 0.058164453100034284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 139.4, 136, 143, 140.0, 143.0, 143.0, 143.0, 0.07396230880743172, 0.05496612988521049, 0.041531569886985586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 1000.4210526315788, 132, 2006, 1455.0, 1765.0, 2006.0, 2006.0, 0.10603447794761896, 50.22933225833905, 0.05754070817079364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 418.0, 136, 1589, 143.0, 1553.3, 1589.0, 1589.0, 0.0932102181701669, 15.746172145801172, 0.053295490955696016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 632.5263157894736, 138, 1204, 792.0, 1191.0, 1204.0, 1204.0, 0.1060196861817289, 16.420539988951635, 0.0576362161155503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 351.12499999999994, 137, 1117, 143.0, 1115.6, 1117.0, 1117.0, 0.09305625832417311, 5.150684345174742, 0.05329833545617923], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 479.8, 150, 1052, 483.0, 798.8000000000002, 1052.0, 1052.0, 0.08194750988833285, 0.01542917959616267, 0.05610950270153624], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b860d66-2bec-4176-a74d-32e7e8bd0df5", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fe51c4f-2471-436e-9b15-2986fa4b2918", 3, 0, 0.0, 343.6666666666667, 243, 461, 327.0, 461.0, 461.0, 461.0, 0.07098071690524074, 0.03211692594345203, 0.045518233171655036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 377.4705882352941, 278, 839, 291.0, 734.1999999999999, 839.0, 839.0, 0.09867714579258063, 0.1529303030984624, 0.22192721363311838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d083efe-7efd-407d-8e07-8d565a6dc5c9", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7822eef2-5330-4b02-ae09-63dcd576d913", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a170f500-0744-471c-a7e3-bf529d2105b5", 3, 0, 0.0, 353.6666666666667, 233, 528, 300.0, 528.0, 528.0, 528.0, 0.016928780619931947, 0.02333769073092832, 0.010856021426193338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 614.7619047619048, 177, 1355, 561.0, 1268.6000000000001, 1349.1999999999998, 1355.0, 0.09198302256212139, 0.05650129022614683, 0.041589979927990434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 176.42105263157893, 134, 519, 142.0, 416.0, 519.0, 519.0, 0.10619389888105166, 0.07891948930515655, 0.05330435939927788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/189f905c-7711-498a-86e5-e73ceb423941", 3, 0, 0.0, 363.33333333333337, 225, 627, 238.0, 627.0, 627.0, 627.0, 0.10087085168622441, 0.04564143354292055, 0.06468606048888739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 231.73684210526318, 133, 433, 145.0, 430.0, 433.0, 433.0, 0.10619508596212748, 0.112362872101992, 0.05587031763509133], "isController": false}, {"data": ["login", 21, 0, 0.0, 2731.52380952381, 1547, 4148, 2561.0, 3543.0, 4087.599999999999, 4148.0, 0.09070177257178397, 25.960644980034814, 0.17265983352985384], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 187.5, 136, 512, 147.0, 438.50000000000006, 512.0, 512.0, 0.09805784186947276, 0.07938471768534464, 0.034856498477039144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1196.6315789473686, 288, 2149, 1591.0, 1914.0, 2149.0, 2149.0, 0.10593929121038427, 66.78315233338257, 0.22399386423322254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e122ec2-f247-4c6f-9369-582a6e171ae5", 3, 0, 0.0, 384.0, 252, 511, 389.0, 511.0, 511.0, 511.0, 0.02513741788443491, 0.025211062663393218, 0.016120023838651295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa230a66-b43f-43bb-86d5-e4ca0d2f0689", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a6fef59-710b-4d04-843f-3ae50ecef448", 3, 0, 0.0, 615.3333333333334, 237, 1056, 553.0, 1056.0, 1056.0, 1056.0, 0.026280748475716587, 0.02635774285601654, 0.01685321435454482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 416.7058823529411, 277, 586, 295.0, 581.2, 586.0, 586.0, 0.0996798517701969, 0.15448430152275633, 0.2241823228776987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 947.625, 140, 1787, 1238.5, 1787.0, 1787.0, 1787.0, 0.10539073615429205, 78.81305021374558, 0.1744890813550614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46f0c2b3-039a-4e4b-9e95-1e693f2aa7ba", 3, 0, 0.0, 457.66666666666663, 248, 836, 289.0, 836.0, 836.0, 836.0, 0.02625613737211073, 0.026333059649568086, 0.016837431843443405], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1141.8260869565217, 154, 1995, 1211.0, 1826.4000000000003, 1976.7999999999997, 1995.0, 0.0902555409053808, 0.02857274596596974, 0.04072076161941986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 192.26315789473682, 140, 437, 148.0, 435.0, 437.0, 437.0, 0.09587050417793565, 0.0744307136928309, 0.03407896828200056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 652.3125000000001, 282, 1734, 296.0, 1692.7, 1734.0, 1734.0, 0.0929762271409229, 20.973056824091884, 0.204645306589109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fb7d603-bfff-4e52-b9ba-8a4bb128365d", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 526.6666666666666, 285, 862, 564.5, 796.6000000000003, 862.0, 862.0, 0.08617099197173592, 0.13354820728432118, 0.1938005805770584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 144.2, 141, 148, 145.0, 148.0, 148.0, 148.0, 0.02710835208327686, 0.020145953061888367, 0.01360712204180108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 140.8, 135, 145, 141.0, 145.0, 145.0, 145.0, 0.027108499056624234, 0.007253641349135782, 0.015460315868231008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 143.2, 136, 148, 143.0, 148.0, 148.0, 148.0, 0.027107764205823833, 0.007306389571100955, 0.0159364004413144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 138.6, 136, 142, 139.0, 142.0, 142.0, 142.0, 0.027108939986228656, 0.007306706480663193, 0.015963565245796757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 1.9661458333333335, 4.12109375], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1635.0909090909092, 1091, 3741, 1548.0, 2144.2, 2602.199999999998, 3741.0, 0.2516517505810868, 301.0629819988927, 0.4969139059325756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1141.8260869565217, 154, 1995, 1211.0, 1826.4000000000003, 1976.7999999999997, 1995.0, 0.090554033197896, 0.02866724148792088, 0.04085543294670699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 143.85714285714286, 141, 147, 144.0, 147.0, 147.0, 147.0, 0.03997624269005848, 0.010774846662554823, 0.023540697599712168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 140.57142857142858, 136, 146, 141.0, 146.0, 146.0, 146.0, 0.03997624269005848, 0.010774846662554823, 0.02350165830021016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 400.157894736842, 135, 1612, 142.0, 1361.0, 1612.0, 1612.0, 0.09367773871799549, 13.33042984985677, 0.05380114373123363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa230a66-b43f-43bb-86d5-e4ca0d2f0689", 3, 0, 0.0, 366.6666666666667, 267, 497, 336.0, 497.0, 497.0, 497.0, 0.05782017924255565, 0.026162125373421993, 0.03707869567312325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 345.84210526315786, 134, 1255, 144.0, 1076.0, 1255.0, 1255.0, 0.09368328147881524, 4.3706313236215, 0.053895814637766194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 141.57142857142858, 136, 152, 141.0, 152.0, 152.0, 152.0, 0.03997647099135937, 0.01069682915198483, 0.02279908111225964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 159.8421052631579, 133, 455, 144.0, 162.0, 455.0, 455.0, 0.09381001989759896, 0.06971623549030548, 0.04708823264391197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.85714285714286, 138, 152, 145.0, 152.0, 152.0, 152.0, 0.03997692760178411, 0.029709415922810265, 0.020066543737614292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 186.3684210526316, 132, 435, 143.0, 422.0, 435.0, 435.0, 0.09381372544178858, 0.04735047203116591, 0.052259105486127916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 153.14285714285717, 144, 172, 148.0, 172.0, 172.0, 172.0, 0.03787940280415808, 0.029815233066554113, 0.013464943965540566], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 604.7857142857143, 146, 1273, 520.5, 1110.0, 1273.0, 1273.0, 0.07668249612479527, 0.014329827505463627, 0.05218967038850639], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6941ec97-779d-48cd-943f-d2b066eef681", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1441.2380952380952, 803, 2584, 1382.0, 1866.4, 2513.999999999999, 2584.0, 0.09357663257803624, 0.04843321803355391, 0.043041595648686586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 290.0, 284, 300, 290.0, 300.0, 300.0, 300.0, 0.039944534161136254, 0.061906226282932846, 0.08983619352841483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1d0411b-f1b5-4d6f-9a84-960f6ccf5aac", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 1442.4912280701753, 727, 2823, 1140.0, 2500.4, 2629.7999999999997, 2823.0, 0.2661176239898035, 90.41416032448842, 0.9661581616991377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fe51c4f-2471-436e-9b15-2986fa4b2918", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 278.21818181818173, 137, 2018, 147.0, 578.0, 706.3999999999976, 2018.0, 0.252809634345338, 0.1878790348992209, 0.1222077822274827], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 917.4363636363635, 672, 1342, 841.0, 1150.8, 1269.1999999999998, 1342.0, 0.252723671937104, 74.30915076517836, 0.12710223735118023], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 206.83636363636364, 133, 561, 144.0, 426.4, 431.2, 561.0, 0.25336981858720986, 0.44834581179689875, 0.12322086880510792], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1350.363636363636, 939, 2000, 1322.0, 1762.8, 1875.2, 2000.0, 0.25237461570228975, 227.08712283617444, 0.1266802270224384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 191.58333333333334, 141, 426, 147.0, 420.6, 426.0, 426.0, 0.08826449928285093, 0.06593978706189547, 0.03137527122945092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 5, 2.9585798816568047, 202.73964497041422, 135, 572, 149.0, 337.0, 427.0, 535.6000000000006, 0.7118157197552027, 1.5649654582471644, 0.3418571335307323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 205.6, 145, 431, 150.0, 431.0, 431.0, 431.0, 0.028098096073010094, 0.02175956072841504, 0.009987995088452805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b860d66-2bec-4176-a74d-32e7e8bd0df5", 3, 0, 0.0, 373.6666666666667, 293, 510, 318.0, 510.0, 510.0, 510.0, 0.018961060302492116, 0.02613935233758272, 0.012159273696585114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 180.0, 137, 424, 145.0, 422.4, 424.0, 424.0, 0.10022698464168854, 0.08133654710668278, 0.03562756094685022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e122ec2-f247-4c6f-9369-582a6e171ae5", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 289.2, 282, 292, 291.0, 292.0, 292.0, 292.0, 0.0270866175857156, 0.04197896690286197, 0.06091843779287406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1d0411b-f1b5-4d6f-9a84-960f6ccf5aac", 3, 0, 0.0, 399.6666666666667, 362, 463, 374.0, 463.0, 463.0, 463.0, 0.02779373343956716, 0.02787516039300339, 0.017823455363264094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f481d0f-cf19-4ed8-b6b3-0522235500f2", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 594.1052631578948, 277, 2067, 297.0, 1499.0, 2067.0, 2067.0, 0.09360989308764842, 17.80479796891166, 0.2067491116297975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a170f500-0744-471c-a7e3-bf529d2105b5", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 148.0, 142, 157, 147.0, 156.2, 157.0, 157.0, 0.09563886763580719, 0.07929433459257842, 0.03399662872991584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1e000bd-5abc-4780-87b5-c8cd2a17f1f5", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.5980073735955056, 1.1173776919475655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46f0c2b3-039a-4e4b-9e95-1e693f2aa7ba", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a6fef59-710b-4d04-843f-3ae50ecef448", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=189f905c-7711-498a-86e5-e73ceb423941", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 0.17173389971482889, 0.6553736929657794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 147.63157894736847, 138, 159, 147.0, 158.0, 159.0, 159.0, 0.10403719055780361, 0.08077106102876354, 0.03698197008109425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc3f9d2a-0822-45ed-ba7e-92471643ab32", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d083efe-7efd-407d-8e07-8d565a6dc5c9", 3, 0, 0.0, 665.0, 296, 1273, 426.0, 1273.0, 1273.0, 1273.0, 0.07845188284518828, 0.035497433969665274, 0.050309312892259414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 172.08333333333334, 133, 439, 145.0, 367.90000000000026, 439.0, 439.0, 0.08642793350810982, 0.06423013417936678, 0.04338277131168794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 253.91666666666669, 133, 432, 145.5, 425.1, 432.0, 432.0, 0.08642980099538321, 0.02312672409446777, 0.04929199588017948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 258.91666666666663, 132, 441, 143.5, 437.7, 441.0, 441.0, 0.08626204973007168, 0.02325031809130838, 0.05071265032959292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 279.3333333333333, 134, 432, 275.5, 429.6, 432.0, 432.0, 0.08636013616114802, 0.023276755449684425, 0.05085465049333228], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.39001560062402496], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 13.333333333333334, 0.15600624024961], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.078003120124805], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.5460218408736349], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1282, 15, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
