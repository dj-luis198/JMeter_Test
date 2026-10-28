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

    var data = {"OkPercent": 96.25550660792952, "KoPercent": 3.7444933920704844};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7963544940289127, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4824561403508772, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d130d13-cf94-46bf-9d2a-602f68745b30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e3458972-28d8-455c-814a-d09c904dc67c"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3494be0d-c056-4854-af71-919bab17ef01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8d1568e-4a69-463b-b498-f0f876883d86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d130d13-cf94-46bf-9d2a-602f68745b30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4022215-1191-499e-97dd-058e17c25f01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0cbd1a42-4710-4f16-98ff-67e3f53c03cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9f7e1b2-f6e3-4236-9d61-932674a50698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1da90402-17ea-4938-af31-a970a1ea59a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8d1568e-4a69-463b-b498-f0f876883d86"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3494be0d-c056-4854-af71-919bab17ef01"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb2ea277-864a-4535-bd33-50a4fbce2dfa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1da90402-17ea-4938-af31-a970a1ea59a2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2712f389-fd1e-4854-800f-72b80e3754a8"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8700564971751412, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33a89dc9-e682-4082-8ce7-600f47344c57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33a89dc9-e682-4082-8ce7-600f47344c57"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37316b09-1179-47c0-8dd8-94ced2f7bcd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37316b09-1179-47c0-8dd8-94ced2f7bcd5"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2712f389-fd1e-4854-800f-72b80e3754a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4022215-1191-499e-97dd-058e17c25f01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9f7e1b2-f6e3-4236-9d61-932674a50698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3458972-28d8-455c-814a-d09c904dc67c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0fa38f0b-3db0-456f-a328-90414dd2eccc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fa38f0b-3db0-456f-a328-90414dd2eccc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1362, 51, 3.7444933920704844, 268.20411160058757, 78, 3392, 87.0, 648.7, 828.9499999999994, 1217.8399999999965, 5.247867331447903, 740.9263905451694, 3.8480063365975172], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1205.40350877193, 964, 1814, 1181.0, 1405.4, 1467.6999999999996, 1814.0, 0.2519426101254409, 303.1719767991797, 1.2387998456851514], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 256.31250000000006, 162, 641, 167.0, 535.3000000000001, 641.0, 641.0, 0.08948896209583149, 6.821266641101721, 0.19983173628162176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 105.66666666666667, 81, 291, 84.0, 247.80000000000007, 291.0, 291.0, 0.11374479459585843, 0.08830772627315181, 0.040432719953996554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 238.6, 163, 329, 174.0, 326.6, 329.0, 329.0, 0.06674052618230841, 0.10343478032355807, 0.15010100761509404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 98.6, 81, 244, 82.5, 228.00000000000006, 244.0, 244.0, 0.0648508430609598, 0.04819481598573282, 0.032552083333333336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 97.9, 80, 241, 81.5, 225.60000000000005, 241.0, 241.0, 0.06485168419823863, 0.01735289206085682, 0.036985726144307965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d130d13-cf94-46bf-9d2a-602f68745b30", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 97.89999999999999, 80, 241, 81.5, 225.60000000000005, 241.0, 241.0, 0.06485252535733742, 0.01747978222521985, 0.03812619166515344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 82.1, 80, 90, 81.0, 89.3, 90.0, 90.0, 0.06485252535733742, 0.01747978222521985, 0.03818952420944772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.04604348346578509, 0.013579230475260835, 0.02846242679086129], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 776.2456140350879, 631, 1178, 645.0, 1055.2, 1099.3999999999999, 1178.0, 0.24757743309979974, 296.18868182933664, 0.48886872043729995], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 444.1176470588235, 82, 991, 490.0, 902.9999999999999, 991.0, 991.0, 0.08279839078892255, 0.01774115335723122, 0.05511172760060004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 444.1176470588235, 82, 991, 490.0, 902.9999999999999, 991.0, 991.0, 0.08353233684169148, 0.017898415465275114, 0.05560025200968975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 644.2916666666666, 167, 1248, 673.0, 1203.0, 1245.5, 1248.0, 0.09368888264296339, 0.028866057103373973, 0.042269788848680746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 100.55555555555556, 78, 261, 81.0, 261.0, 261.0, 261.0, 0.04615124275040895, 0.012439202147571164, 0.027176952518063083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 97.84210526315789, 79, 242, 81.0, 239.0, 242.0, 242.0, 0.09914319408062951, 0.034365835777126104, 0.05610436712724768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 136.44444444444446, 80, 262, 82.0, 262.0, 262.0, 262.0, 0.04611388079049439, 0.01242913193181294, 0.02710991819909924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 93.4736842105263, 81, 289, 82.0, 96.0, 289.0, 289.0, 0.09914267674791148, 0.07367927441910219, 0.049764976414479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 148.89473684210526, 79, 635, 82.0, 326.0, 635.0, 635.0, 0.09914526346549224, 1.5596320438796063, 0.05793495581513061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 125.10526315789474, 80, 717, 82.0, 242.0, 717.0, 717.0, 0.09914371141874652, 4.720562511740703, 0.057837228854994496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 134.6666666666667, 80, 251, 82.0, 242.9, 251.0, 251.0, 0.10671536049041637, 0.028763124507182537, 0.06273695997581119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 125.22222222222223, 79, 241, 82.0, 240.1, 241.0, 241.0, 0.10671599317017644, 0.02876329503414912, 0.062841546759391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.44444444444444, 79, 242, 81.0, 242.0, 242.0, 242.0, 0.04615124275040895, 0.01234906300157427, 0.026320630631092606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 130.88888888888889, 80, 782, 82.0, 296.9000000000008, 782.0, 782.0, 0.10671536049041637, 0.07930702083320981, 0.05356610868366603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 103.44444444444444, 81, 240, 83.0, 240.0, 240.0, 240.0, 0.046150532782261784, 0.03429741742900509, 0.023165404150471247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 107.33333333333334, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.10671599317017644, 0.028554865359988617, 0.06086146485486625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 179.44444444444443, 82, 935, 84.0, 935.0, 935.0, 935.0, 0.04482585156666351, 0.03528284801047929, 0.015934189424087423], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 686.8, 80, 3392, 467.0, 2269.4000000000005, 3392.0, 3392.0, 0.07449973428428106, 0.015186111200786718, 0.05068989082063941], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1032.0, 765, 1585, 1012.0, 1331.0000000000002, 1546.1999999999994, 1585.0, 0.09530005013611333, 0.04932522126185553, 0.04383430040440369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3458972-28d8-455c-814a-d09c904dc67c", 3, 0, 0.0, 781.3333333333334, 184, 1206, 954.0, 1206.0, 1206.0, 1206.0, 0.08734387282732117, 0.03952082787434128, 0.05601153303054124], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 201.05882352941174, 80, 494, 184.0, 441.19999999999993, 494.0, 494.0, 0.08259684480052862, 0.126386268092353, 0.05337384576982689], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 241.0, 163, 484, 166.0, 484.0, 484.0, 484.0, 0.04609404208898199, 0.07143676249532659, 0.10366658098723196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3494be0d-c056-4854-af71-919bab17ef01", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8d1568e-4a69-463b-b498-f0f876883d86", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d130d13-cf94-46bf-9d2a-602f68745b30", 3, 0, 0.0, 286.6666666666667, 176, 475, 209.0, 475.0, 475.0, 475.0, 0.045223630854575876, 0.029074437154227653, 0.029000830984216953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 92.18749999999999, 80, 239, 82.0, 134.0000000000001, 239.0, 239.0, 0.08953102529811033, 0.06653624048033395, 0.04494037793284054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4022215-1191-499e-97dd-058e17c25f01", 3, 0, 0.0, 595.3333333333334, 211, 1067, 508.0, 1067.0, 1067.0, 1067.0, 0.01848519951692012, 0.025483339828827053, 0.011854115575629112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 102.375, 80, 250, 82.0, 243.70000000000002, 250.0, 250.0, 0.08953102529811033, 0.03236100658053036, 0.050590712415155364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 509.5, 395, 640, 557.0, 639.1, 640.0, 640.0, 0.05983044053153363, 17.592136073866662, 0.03412204811564027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 629.5, 549, 823, 557.0, 812.6, 823.0, 823.0, 0.059715039829931565, 53.73169780681588, 0.03399791818442393], "isController": false}, {"data": ["addBook", 60, 21, 35.0, 780.9666666666666, 411, 3482, 671.5, 1209.6, 1276.4499999999998, 3482.0, 0.28135330941830206, 74.0856429582542, 1.0232578075543364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 177.0, 81, 242, 239.0, 242.0, 242.0, 242.0, 0.059885618468724734, 0.10596947330598556, 0.033159321945084884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cbd1a42-4710-4f16-98ff-67e3f53c03cd", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 93.21428571428571, 80, 243, 82.0, 163.0, 243.0, 243.0, 0.10605417853463425, 0.0788156541648991, 0.053234226334767584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9f7e1b2-f6e3-4236-9d61-932674a50698", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 92.42857142857143, 79, 241, 81.0, 162.5, 241.0, 241.0, 0.10592579141698445, 0.0397073941877005, 0.05977536638974638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1da90402-17ea-4938-af31-a970a1ea59a2", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8d1568e-4a69-463b-b498-f0f876883d86", 3, 0, 0.0, 393.0, 347, 456, 376.0, 456.0, 456.0, 456.0, 0.023159406192825215, 0.02737363407752225, 0.014851572330685441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 137.78571428571425, 79, 715, 81.0, 477.5, 715.0, 715.0, 0.10554726255635469, 6.810102863817645, 0.06140235558872755], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 153.43859649122805, 81, 370, 83.0, 328.2, 329.2, 370.0, 0.24835952001254868, 0.18457186985307575, 0.12005660391231601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 115.14285714285714, 79, 394, 82.0, 317.5, 394.0, 394.0, 0.10580331164365445, 2.2486008220539446, 0.06165463626332933], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 467.40350877192975, 392, 649, 406.0, 567.4, 643.1, 649.0, 0.24815300156292852, 72.96522191463102, 0.12480351152823067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3494be0d-c056-4854-af71-919bab17ef01", 3, 0, 0.0, 281.0, 189, 452, 202.0, 452.0, 452.0, 452.0, 0.04578475062572493, 0.029435183100848545, 0.02936066364996032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 288.20000000000005, 80, 1792, 82.0, 1639.5000000000005, 1792.0, 1792.0, 0.0599426947837867, 0.044547256572716486, 0.03365922802800523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb2ea277-864a-4535-bd33-50a4fbce2dfa", 2, 0, 0.0, 366.0, 304, 428, 366.0, 428.0, 428.0, 428.0, 0.013646288209606987, 0.023321293326965066, 0.008482287544350436], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 113.29824561403511, 79, 324, 83.0, 242.0, 247.39999999999975, 324.0, 0.24867157029552653, 0.440032114624506, 0.12093597852262912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 478.56249999999994, 80, 723, 711.5, 722.3, 723.0, 723.0, 0.07280769213267381, 40.95266483263332, 0.038892390231027904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1da90402-17ea-4938-af31-a970a1ea59a2", 3, 0, 0.0, 372.6666666666667, 215, 509, 394.0, 509.0, 509.0, 509.0, 0.025161874727413023, 0.025235591157278494, 0.01613570742610796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 141.0625, 79, 558, 82.0, 337.5000000000002, 558.0, 558.0, 0.08953102529811033, 5.057634067464425, 0.05215357088898712], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 619.0350877192983, 535, 815, 560.0, 729.8000000000001, 805.5, 815.0, 0.24797379308544656, 223.12725490971798, 0.12447122035734329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 105.66666666666666, 82, 244, 84.0, 242.8, 244.0, 244.0, 0.06502965352200603, 0.04858172357845178, 0.023116009650400584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2712f389-fd1e-4854-800f-72b80e3754a8", 3, 0, 0.0, 1261.6666666666667, 181, 3392, 212.0, 3392.0, 3392.0, 3392.0, 0.08972096779017256, 0.04059640144151688, 0.057535907078984365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 364.37500000000006, 80, 561, 438.5, 561.0, 561.0, 561.0, 0.07280702951870004, 13.387161475752984, 0.03896313689086681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 151.49999999999997, 79, 550, 82.0, 339.3000000000002, 550.0, 550.0, 0.08953302929408803, 1.6679789142721244, 0.05224217285470468], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 371.25, 82, 1288, 394.0, 821.8000000000004, 1288.0, 1288.0, 0.07909202356942302, 0.01711311178916044, 0.05276824399642109], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 21, 11.864406779661017, 141.08474576271195, 81, 2502, 84.0, 227.80000000000007, 273.4, 1481.7599999999984, 0.7325097771432119, 1.6199738564880917, 0.3498303225939951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33a89dc9-e682-4082-8ce7-600f47344c57", 3, 0, 0.0, 701.6666666666666, 467, 1144, 494.0, 1144.0, 1144.0, 1144.0, 0.07541667714120515, 0.03412408243042811, 0.04836290819276502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 121.0, 81, 298, 84.0, 292.6, 298.0, 298.0, 0.06381376590558115, 0.04941827769836509, 0.02268379959924955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33a89dc9-e682-4082-8ce7-600f47344c57", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 232.35714285714286, 162, 797, 164.5, 641.0, 797.0, 797.0, 0.10548205298212833, 9.165600171690878, 0.23530385423887165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 92.68421052631577, 81, 246, 84.0, 91.0, 246.0, 246.0, 0.0937581729986331, 0.07608695484557042, 0.03332810055810786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 480.13043478260875, 100, 2195, 247.0, 1301.600000000001, 2077.1999999999985, 2195.0, 0.0972285632154754, 0.059723404553255886, 0.04396174293824718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.25, 81, 84, 82.0, 83.3, 84.0, 84.0, 0.0728066982162359, 0.054107321623589374, 0.036545549690571534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37316b09-1179-47c0-8dd8-94ced2f7bcd5", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 121.4375, 79, 244, 81.5, 243.3, 244.0, 244.0, 0.07280769213267381, 0.0878278336981302, 0.03770144409506864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37316b09-1179-47c0-8dd8-94ced2f7bcd5", 3, 0, 0.0, 328.6666666666667, 191, 545, 250.0, 545.0, 545.0, 545.0, 0.04780876494023905, 0.030300672310756973, 0.030658615537848606], "isController": false}, {"data": ["login", 23, 0, 0.0, 2206.1739130434785, 1201, 4229, 2016.0, 3488.8, 4102.399999999998, 4229.0, 0.09364553941866478, 48.83272934505124, 0.20880585523824646], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2712f389-fd1e-4854-800f-72b80e3754a8", 1, 0, 0.0, 1288.0, 1288, 1288, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 0.14026712927018634, 0.5352896933229814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 197.70000000000002, 163, 485, 164.5, 453.9000000000001, 485.0, 485.0, 0.06481637520903281, 0.10045272212571783, 0.14577354697890874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4022215-1191-499e-97dd-058e17c25f01", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 84.875, 82, 93, 84.0, 92.3, 93.0, 93.0, 0.0868805013004925, 0.07033587458799637, 0.030883303196659443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 284.33333333333337, 164, 866, 244.5, 519.5000000000006, 866.0, 866.0, 0.10666224215884378, 0.1653056428770362, 0.23988588251154025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9f7e1b2-f6e3-4236-9d61-932674a50698", 3, 0, 0.0, 271.0, 181, 449, 183.0, 449.0, 449.0, 449.0, 0.025465812147192395, 0.02554041901871737, 0.016330615211578456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3458972-28d8-455c-814a-d09c904dc67c", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 95.35714285714286, 83, 240, 83.0, 168.0, 240.0, 240.0, 0.1104353519338019, 0.09156212284355254, 0.039256316507718644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 562.6875, 164, 807, 795.5, 805.6, 807.0, 807.0, 0.07277921061848683, 54.460571365133305, 0.15204387335507613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 94.1875, 81, 241, 84.0, 134.6000000000001, 241.0, 241.0, 0.07283553281468363, 0.056547117761399895, 0.025890755805219576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 256.57894736842104, 162, 799, 166.0, 532.0, 799.0, 799.0, 0.09910079071999332, 6.385450651066116, 0.22154548172111996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, 47.36842105263158, 526.8421052631578, 80, 2512, 637.0, 979.0, 2512.0, 2512.0, 0.11139774859287055, 70.15645383222913, 0.16706799476723733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fa38f0b-3db0-456f-a328-90414dd2eccc", 3, 0, 0.0, 918.3333333333333, 205, 1521, 1029.0, 1521.0, 1521.0, 1521.0, 0.019872024164381386, 0.02348805981148073, 0.012743452996038842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 82.13333333333331, 80, 88, 82.0, 85.6, 88.0, 88.0, 0.0667678570633716, 0.04961947189963456, 0.0335143345025127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fa38f0b-3db0-456f-a328-90414dd2eccc", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 122.93333333333332, 80, 241, 81.0, 240.4, 241.0, 241.0, 0.0667663711141972, 0.01786522039579105, 0.038077696026065595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 126.53333333333333, 79, 242, 82.0, 241.4, 242.0, 242.0, 0.06676666829874078, 0.017995703564894976, 0.039251498355314406], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 644.2916666666666, 167, 1248, 673.0, 1203.0, 1245.5, 1248.0, 0.09693131608494414, 0.02986506857890613, 0.04373268362426191], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 130.93333333333334, 78, 241, 82.0, 241.0, 241.0, 241.0, 0.06676666829874078, 0.017995703564894976, 0.039316700179824894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 21.568627450980394, 0.8076358296622613], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.803921568627452, 0.3671071953010279], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 7.8431372549019605, 0.2936857562408223], "isController": false}, {"data": ["401/Unauthorized", 31, 60.78431372549019, 2.276064610866373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1362, 51, "401/Unauthorized", 31, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
