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

    var data = {"OkPercent": 97.4702380952381, "KoPercent": 2.5297619047619047};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7725239616613419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0106d141-f6ae-4fc8-971f-320bd90b0c7b"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e99c6fcb-47b6-4f78-a46d-b2c8f6f54f68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/857a7470-03df-41bb-8c80-20f488c84447"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a37fc4a-049f-482a-adf9-cab9e3f89155"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b273bd2-0308-4aa2-b71c-fdaf698c23ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cb80aff-6d9e-44c6-a70b-0537c8f38bcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/07cd2c42-e55d-4a30-b864-d175166d70e2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c27ac95-0d3f-414e-8b15-8c5a980dcdda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bff93acb-85bd-461c-9819-0c25766f78a0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fcec8cc-6882-4a91-a46d-16238c25fc43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a1d2963-2bed-404b-a70a-d3c25b590d59"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e99c6fcb-47b6-4f78-a46d-b2c8f6f54f68"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42b120de-6c7b-42f3-95b7-81ebe7bf2fbb"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cb80aff-6d9e-44c6-a70b-0537c8f38bcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/305d062a-d180-420c-ba60-2963981f335c"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a37fc4a-049f-482a-adf9-cab9e3f89155"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9c05807-2812-433e-b6b8-ae5cf4bcc6c5"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c27ac95-0d3f-414e-8b15-8c5a980dcdda"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=857a7470-03df-41bb-8c80-20f488c84447"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.543859649122807, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b273bd2-0308-4aa2-b71c-fdaf698c23ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8926553672316384, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07cd2c42-e55d-4a30-b864-d175166d70e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bff93acb-85bd-461c-9819-0c25766f78a0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a1d2963-2bed-404b-a70a-d3c25b590d59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fcec8cc-6882-4a91-a46d-16238c25fc43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42b120de-6c7b-42f3-95b7-81ebe7bf2fbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0106d141-f6ae-4fc8-971f-320bd90b0c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 34, 2.5297619047619047, 353.57366071428544, 97, 2632, 114.0, 958.5, 1181.75, 1595.8499999999997, 5.248298403252071, 741.5282174443929, 3.8451774241652115], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1627.4736842105262, 1224, 2152, 1601.0, 1941.2000000000003, 2027.3999999999999, 2152.0, 0.25891437656143534, 311.56128012860546, 1.273079966784011], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0106d141-f6ae-4fc8-971f-320bd90b0c7b", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 556.3333333333334, 103, 1185, 511.0, 1045.2, 1185.0, 1185.0, 0.08537230863797018, 0.016724301867946115, 0.05748179791236248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 556.3333333333334, 103, 1185, 511.0, 1045.2, 1185.0, 1185.0, 0.08366100560528737, 0.01638906027775454, 0.05632956510220587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e99c6fcb-47b6-4f78-a46d-b2c8f6f54f68", 1, 0, 0.0, 2168.0, 2168, 2168, 2168.0, 2168.0, 2168.0, 2168.0, 0.46125461254612543, 0.08333213214944649, 0.3180134340405904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 161.47058823529412, 98, 312, 103.0, 308.0, 312.0, 312.0, 0.08495794581682067, 0.03774498810588759, 0.04761315024063089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 139.47058823529412, 98, 328, 103.0, 311.2, 328.0, 328.0, 0.08504124500382686, 0.0631995971171018, 0.04268671868356153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 195.1764705882353, 99, 602, 103.0, 594.8, 602.0, 602.0, 0.08495539841583169, 2.958993403463182, 0.04916852246320682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 259.52941176470586, 98, 1212, 102.0, 1099.1999999999998, 1212.0, 1212.0, 0.08504379755574121, 9.022879204665402, 0.04913663349124799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/857a7470-03df-41bb-8c80-20f488c84447", 3, 0, 0.0, 380.0, 247, 603, 290.0, 603.0, 603.0, 603.0, 0.026567951965142847, 0.031402419786925026, 0.017037391071396943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a37fc4a-049f-482a-adf9-cab9e3f89155", 3, 0, 0.0, 513.6666666666666, 397, 695, 449.0, 695.0, 695.0, 695.0, 0.0822143052891203, 0.037199832145793366, 0.05272206426418197], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 237.26666666666665, 101, 449, 218.0, 425.6, 449.0, 449.0, 0.0850470310081475, 0.14837827714559484, 0.05497050285474534], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 112.26315789473684, 98, 309, 101.0, 104.0, 309.0, 309.0, 0.11937672782106057, 0.08871649401545614, 0.05992152158205579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 723.25, 583, 881, 774.5, 881.0, 881.0, 881.0, 0.040851341966583604, 12.011650930389314, 0.023298030965317212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 132.73684210526315, 98, 303, 101.0, 303.0, 303.0, 303.0, 0.11937672782106057, 0.050816100936164864, 0.06702669483538577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1038.375, 681, 1222, 1081.5, 1222.0, 1222.0, 1222.0, 0.04087179539579225, 36.77651334208671, 0.02326978194897156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b273bd2-0308-4aa2-b71c-fdaf698c23ca", 3, 0, 0.0, 326.6666666666667, 186, 410, 384.0, 410.0, 410.0, 410.0, 0.06489573418707277, 0.029363629726572638, 0.0416160795405382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 174.50000000000003, 99, 299, 104.5, 299.0, 299.0, 299.0, 0.040992426649176565, 0.07253737996905073, 0.02269795499031554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 121.0, 100, 298, 103.0, 259.8000000000001, 298.0, 298.0, 0.0724475413938907, 0.05384040918042072, 0.03636526980123029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 166.0, 99, 410, 105.0, 387.4000000000001, 410.0, 410.0, 0.07244420150025355, 0.01938448360456003, 0.04131583366811335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 140.0, 100, 309, 103.0, 308.4, 309.0, 309.0, 0.07244563284553274, 0.019526361977897498, 0.04259010837208077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 101.99999999999999, 98, 105, 102.0, 105.0, 105.0, 105.0, 0.07244563284553274, 0.019526361977897498, 0.04266085606040649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cb80aff-6d9e-44c6-a70b-0537c8f38bcd", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 125.25, 98, 296, 101.5, 296.0, 296.0, 296.0, 0.04099326685591891, 0.030464722731791304, 0.023018680119290407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 676.3125, 99, 1485, 865.0, 1361.8000000000002, 1485.0, 1485.0, 0.09767830870008486, 49.450269769555504, 0.052702407770309455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 214.15789473684214, 98, 1073, 102.0, 1068.0, 1073.0, 1073.0, 0.11937822792445243, 11.335814391202454, 0.06910143929302957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 532.3125, 99, 916, 782.0, 892.9, 916.0, 916.0, 0.09755859613180166, 16.14707901560328, 0.05273308882710178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 195.1578947368421, 98, 801, 103.0, 779.0, 801.0, 801.0, 0.11937972806554575, 3.72369522669582, 0.06921888940724823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07cd2c42-e55d-4a30-b864-d175166d70e2", 3, 0, 0.0, 755.6666666666666, 230, 1256, 781.0, 1256.0, 1256.0, 1256.0, 0.02336321228593457, 0.0322080742288193, 0.014982268295342153], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 577.8571428571429, 108, 2168, 442.0, 1602.0, 2168.0, 2168.0, 0.08472063371034017, 0.016688830189592677, 0.057548097870486356], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 289.2727272727273, 204, 708, 211.0, 648.0000000000002, 708.0, 708.0, 0.07239604585960432, 0.11219973122967974, 0.16282040392057495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 606.0, 110, 1784, 523.0, 1233.4, 1702.3999999999987, 1784.0, 0.10101705810776683, 0.06205051713846225, 0.04567470498427348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 144.56250000000003, 100, 362, 104.0, 320.70000000000005, 362.0, 362.0, 0.09767711608314765, 0.07259012240163609, 0.049029333658923716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 189.43749999999997, 100, 307, 103.0, 306.3, 307.0, 307.0, 0.09755800128044877, 0.10852613106307735, 0.051029789488125366], "isController": false}, {"data": ["login", 22, 0, 0.0, 2658.863636363636, 1466, 5035, 2561.5, 4060.3999999999987, 4955.949999999999, 5035.0, 0.09741064786936347, 42.50713906587616, 0.20570908033279017], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c27ac95-0d3f-414e-8b15-8c5a980dcdda", 3, 0, 0.0, 285.6666666666667, 199, 442, 216.0, 442.0, 442.0, 442.0, 0.044775451112669964, 0.0287863007641677, 0.028713424053372336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 108.47368421052632, 103, 125, 106.0, 118.0, 125.0, 125.0, 0.12065253973596145, 0.09767671429796097, 0.04288820748426754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bff93acb-85bd-461c-9819-0c25766f78a0", 1, 0, 0.0, 1036.0, 1036, 1036, 1036.0, 1036.0, 1036.0, 1036.0, 0.9652509652509653, 0.1743861607142857, 0.6654952944015444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fcec8cc-6882-4a91-a46d-16238c25fc43", 3, 0, 0.0, 327.0, 189, 599, 193.0, 599.0, 599.0, 599.0, 0.02078785988982434, 0.028657743044728547, 0.013330756504867824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a1d2963-2bed-404b-a70a-d3c25b590d59", 3, 0, 0.0, 332.6666666666667, 270, 417, 311.0, 417.0, 417.0, 417.0, 0.043911007025761124, 0.028745128622658083, 0.028159076771077287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e99c6fcb-47b6-4f78-a46d-b2c8f6f54f68", 3, 0, 0.0, 533.3333333333333, 193, 1103, 304.0, 1103.0, 1103.0, 1103.0, 0.04391357807834183, 0.028232199448152702, 0.02816072552549915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 835.0000000000001, 204, 1592, 969.0, 1466.0000000000002, 1592.0, 1592.0, 0.09749677041947985, 65.67612510701794, 0.20524069896044067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42b120de-6c7b-42f3-95b7-81ebe7bf2fbb", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 435.94117647058823, 199, 1327, 210.0, 1204.6, 1327.0, 1327.0, 0.08491126772522713, 12.06710179268914, 0.1884115084112103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 818.4166666666666, 101, 1417, 1103.0, 1387.9, 1417.0, 1417.0, 0.06124480057161814, 48.85217833720366, 0.10559345254803888], "isController": false}, {"data": ["register", 24, 9, 37.5, 1030.1666666666667, 242, 1724, 1010.0, 1699.0, 1719.5, 1724.0, 0.09585583282742756, 0.029814533940952806, 0.04324745582643704], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 359.7368421052632, 200, 1176, 208.0, 1169.0, 1176.0, 1176.0, 0.1192987743620655, 15.188881305175682, 0.2650927175161995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 123.35714285714286, 100, 314, 107.0, 224.0, 314.0, 314.0, 0.0840462254239832, 0.06525073165240883, 0.029875806693681527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 314.1176470588235, 203, 1009, 211.0, 683.3999999999997, 1009.0, 1009.0, 0.10319103087839848, 7.412421354776835, 0.230525965063766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.7, 102, 307, 104.0, 286.70000000000005, 307.0, 307.0, 0.05210748732485371, 0.03872441196700554, 0.02615551609860821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cb80aff-6d9e-44c6-a70b-0537c8f38bcd", 3, 0, 0.0, 361.0, 259, 539, 285.0, 539.0, 539.0, 539.0, 0.05815193161332843, 0.026993702630405708, 0.03729144052026595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 121.6, 99, 295, 102.0, 276.30000000000007, 295.0, 295.0, 0.05210830189465786, 0.013943041717906498, 0.02971801592429706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 101.0, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.05210748732485371, 0.014044596193026976, 0.030633503290587824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 161.7, 100, 304, 103.5, 303.9, 304.0, 304.0, 0.05205567875399527, 0.014030632164162789, 0.0306538811412687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 129.0, 108, 150, 129.0, 150.0, 150.0, 150.0, 0.01789356905128297, 0.005277204935046344, 0.01106116133736535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/305d062a-d180-420c-ba60-2963981f335c", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1091.0, 783, 1716, 1009.0, 1516.6000000000001, 1608.4999999999998, 1716.0, 0.2683110525324798, 320.9932988432028, 0.5298095197467521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1030.1666666666667, 242, 1724, 1010.0, 1699.0, 1719.5, 1724.0, 0.09371961434378698, 0.02915009489110952, 0.04228365412776326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 102.53846153846155, 100, 105, 102.0, 105.0, 105.0, 105.0, 0.06167568080463043, 0.01662352334187304, 0.03631878469257045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 118.3076923076923, 99, 308, 103.0, 227.5999999999999, 308.0, 308.0, 0.061675095596398166, 0.016623365609966696, 0.03625821049710127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 194.2142857142857, 98, 397, 109.5, 350.5, 397.0, 397.0, 0.08556045151472556, 0.023061215447328375, 0.050300187316274204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 182.00000000000003, 98, 413, 103.5, 359.5, 413.0, 413.0, 0.08555835996846564, 0.023060651710250502, 0.05038251080174295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 117.15384615384615, 97, 301, 102.0, 223.39999999999992, 301.0, 301.0, 0.06161721490188644, 0.016487418831168832, 0.035141067873732106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 133.57142857142858, 99, 322, 103.5, 316.0, 322.0, 322.0, 0.085558882845444, 0.06358428695838171, 0.042946548615779505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 104.61538461538461, 100, 113, 104.0, 112.2, 113.0, 113.0, 0.06167451039927129, 0.045834279701020955, 0.030957713227759222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 159.5, 99, 301, 103.5, 300.5, 301.0, 301.0, 0.08556045151472556, 0.022894105190463674, 0.04879619500449192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 153.15384615384616, 103, 316, 107.0, 311.2, 316.0, 316.0, 0.06290555939978418, 0.04951355554318951, 0.022360960567892035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a37fc4a-049f-482a-adf9-cab9e3f89155", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 601.5714285714286, 102, 2110, 443.5, 1606.5, 2110.0, 2110.0, 0.08689553294892405, 0.016777820535897166, 0.0591345437674179], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e9c05807-2812-433e-b6b8-ae5cf4bcc6c5", 2, 0, 0.0, 203.0, 193, 213, 203.0, 213.0, 213.0, 213.0, 0.015018171988105608, 0.029515694459045446, 0.009335025850028534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1395.1818181818182, 935, 2632, 1279.5, 2237.0999999999995, 2598.5499999999997, 2632.0, 0.10028992906766836, 0.05190787344322678, 0.046129449795773235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 239.6153846153846, 205, 408, 208.0, 406.4, 408.0, 408.0, 0.06158656465404931, 0.09544714658786745, 0.13850962734206598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c27ac95-0d3f-414e-8b15-8c5a980dcdda", 1, 0, 0.0, 856.0, 856, 856, 856.0, 856.0, 856.0, 856.0, 1.1682242990654206, 0.21105614778037385, 0.8054358936915889], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 997.7666666666665, 527, 2102, 838.0, 1738.9, 1831.3499999999997, 2102.0, 0.2787275159803776, 78.92296639242976, 1.0134131447315853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=857a7470-03df-41bb-8c80-20f488c84447", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 183.80701754385973, 100, 480, 105.0, 410.4, 418.9999999999999, 480.0, 0.2691879026012052, 0.200050775272966, 0.1301250115113248], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 651.9824561403508, 493, 917, 602.0, 832.0000000000001, 901.9, 917.0, 0.2691078367034762, 79.12663921196256, 0.13534232021708031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b273bd2-0308-4aa2-b71c-fdaf698c23ca", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 164.05263157894737, 99, 421, 103.0, 311.2, 327.79999999999944, 421.0, 0.2696080749983445, 0.4770799139619143, 0.13111798959880427], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 904.6842105263158, 677, 1307, 884.0, 1161.0, 1209.1999999999998, 1307.0, 0.26885651080850337, 241.9175610248268, 0.13495336577692457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 109.82352941176472, 103, 127, 107.0, 119.0, 127.0, 127.0, 0.0986004535620864, 0.07366147165526961, 0.035049379977147896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, 9.6045197740113, 165.5649717514124, 100, 1205, 108.0, 314.20000000000005, 424.9, 992.8399999999997, 0.7494855226497066, 1.6383252015565586, 0.35875218202970843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 106.5, 104, 111, 105.5, 110.9, 111.0, 111.0, 0.052740390700814314, 0.04084290022045483, 0.018747560756930088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07cd2c42-e55d-4a30-b864-d175166d70e2", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 106.29411764705883, 101, 119, 106.0, 112.6, 119.0, 119.0, 0.0810565965765508, 0.06577932788585324, 0.028813087064320796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bff93acb-85bd-461c-9819-0c25766f78a0", 3, 0, 0.0, 840.6666666666666, 194, 2110, 218.0, 2110.0, 2110.0, 2110.0, 0.037987185656038695, 0.02442210015321498, 0.02436027205156127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 286.80000000000007, 204, 612, 207.5, 591.6000000000001, 612.0, 612.0, 0.05202751214842409, 0.08063248220659085, 0.11701109421662176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 359.78571428571433, 206, 626, 400.5, 618.0, 626.0, 626.0, 0.0855050600673047, 0.1325161428972779, 0.19230288411621357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a1d2963-2bed-404b-a70a-d3c25b590d59", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 113.9090909090909, 101, 148, 109.0, 144.20000000000002, 148.0, 148.0, 0.07150750828837027, 0.059286986852369494, 0.02541868458688162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fcec8cc-6882-4a91-a46d-16238c25fc43", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42b120de-6c7b-42f3-95b7-81ebe7bf2fbb", 3, 0, 0.0, 356.0, 244, 445, 379.0, 445.0, 445.0, 445.0, 0.06326311127981274, 0.02862491037725902, 0.04056911758503617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 138.81250000000003, 102, 397, 106.5, 334.70000000000005, 397.0, 397.0, 0.09688514266337257, 0.07521844572009882, 0.03443964055612072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0106d141-f6ae-4fc8-971f-320bd90b0c7b", 3, 0, 0.0, 262.6666666666667, 193, 397, 198.0, 397.0, 397.0, 397.0, 0.029101914906000816, 0.029016655389674642, 0.018662360795840365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 114.47058823529412, 100, 294, 103.0, 146.79999999999987, 294.0, 294.0, 0.10326562348138789, 0.07674330026302362, 0.05183450241155603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 138.3529411764706, 97, 305, 103.0, 304.2, 305.0, 305.0, 0.10326374167056436, 0.03675448893559379, 0.05838245321241351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 185.17647058823528, 98, 905, 103.0, 427.3999999999996, 905.0, 905.0, 0.10325872384365414, 5.4916284982688985, 0.06018284766301212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 144.58823529411765, 100, 605, 103.0, 356.9999999999998, 605.0, 605.0, 0.10325809664957847, 1.8121534969569233, 0.06028332009706261], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.6696428571428571], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.1488095238095238], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.1488095238095238], "isController": false}, {"data": ["401/Unauthorized", 21, 61.76470588235294, 1.5625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 34, "401/Unauthorized", 21, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
