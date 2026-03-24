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

    var data = {"OkPercent": 97.26618705035972, "KoPercent": 2.7338129496402876};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7825015403573629, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/725845ad-3815-477a-a609-b6ecf2929648"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "see books"], "isController": true}, {"data": [0.6176470588235294, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36409d6b-7418-4900-98c7-caf4eb5b199d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbaf34ab-a30f-443f-84a7-daa3145de9a5"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d51a2f6-298e-4cb3-803b-f1e7d78a2f64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/004bc7e1-d0d5-4b66-8322-31849b525677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13c5e44b-d931-4100-90d7-b53afa7872f1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bebf17c1-dbf8-4b62-9957-f8ef7542147c"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48c2248f-f529-423f-8603-b53e7171c9b0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fabd55e-a365-44ac-8551-b9bc2c7331f5"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bdc4fe29-46b6-47f7-9294-988e7cc635bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=871262d2-834a-4c2e-9d3e-48e1106c2bd1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ebb5794a-ff5a-4634-8cfa-11c6800726e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdb89f45-9393-4d3e-8090-71e727faa3ab"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725845ad-3815-477a-a609-b6ecf2929648"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6da05e1d-3d7f-40b7-8cf5-82dbc8a989b5"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c15ba82-f0b5-4cda-8eef-449147bc54ac"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13c5e44b-d931-4100-90d7-b53afa7872f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36409d6b-7418-4900-98c7-caf4eb5b199d"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbaf34ab-a30f-443f-84a7-daa3145de9a5"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb5794a-ff5a-4634-8cfa-11c6800726e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdc4fe29-46b6-47f7-9294-988e7cc635bf"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [0.9833333333333333, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=004bc7e1-d0d5-4b66-8322-31849b525677"], "isController": false}, {"data": [0.8820224719101124, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bebf17c1-dbf8-4b62-9957-f8ef7542147c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48c2248f-f529-423f-8603-b53e7171c9b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d51a2f6-298e-4cb3-803b-f1e7d78a2f64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6da05e1d-3d7f-40b7-8cf5-82dbc8a989b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/871262d2-834a-4c2e-9d3e-48e1106c2bd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c15ba82-f0b5-4cda-8eef-449147bc54ac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0fabd55e-a365-44ac-8551-b9bc2c7331f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1390, 38, 2.7338129496402876, 328.4640287769785, 100, 2078, 115.0, 814.9000000000001, 1006.9000000000001, 1431.159999999998, 5.523193438923017, 802.2039294205912, 4.043941796865687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/725845ad-3815-477a-a609-b6ecf2929648", 3, 0, 0.0, 594.6666666666666, 229, 1149, 406.0, 1149.0, 1149.0, 1149.0, 0.029902517791998085, 0.02492849871917549, 0.019175768245519607], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1485.4166666666667, 1220, 1994, 1440.0, 1764.7, 1871.6499999999996, 1994.0, 0.26552314698033797, 319.5145303393386, 1.3055752393027362], "isController": true}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 458.3529411764706, 105, 921, 456.0, 875.4, 921.0, 921.0, 0.08445778104568669, 0.016961420182428806, 0.05669170332713976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 458.3529411764706, 105, 921, 456.0, 875.4, 921.0, 921.0, 0.08570794764756892, 0.01721248764797225, 0.05753086904077681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 151.66666666666666, 101, 315, 103.0, 311.0, 314.7, 315.0, 0.09791259668868924, 0.03320213239648074, 0.05544920026389776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 104.47619047619047, 101, 114, 104.0, 107.8, 113.39999999999999, 114.0, 0.097911227154047, 0.07276410533616189, 0.04914684644255875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 151.19047619047618, 100, 705, 103.0, 306.4, 665.1999999999994, 705.0, 0.09791259668868924, 1.3960649772469775, 0.0572568314434648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 198.76190476190476, 100, 707, 104.0, 307.6, 667.0999999999995, 707.0, 0.09791305320875063, 4.220483330594099, 0.05716148018892557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36409d6b-7418-4900-98c7-caf4eb5b199d", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbaf34ab-a30f-443f-84a7-daa3145de9a5", 3, 0, 0.0, 574.3333333333333, 213, 1196, 314.0, 1196.0, 1196.0, 1196.0, 0.06482842077966981, 0.042100488103984784, 0.04157291306508773], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 214.58823529411765, 101, 498, 200.0, 350.79999999999984, 498.0, 498.0, 0.08469003447382581, 0.1304454213204671, 0.05473618898581193], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d51a2f6-298e-4cb3-803b-f1e7d78a2f64", 3, 0, 0.0, 254.33333333333331, 185, 383, 195.0, 383.0, 383.0, 383.0, 0.027650788969178587, 0.02773179713998673, 0.017731788499115175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/004bc7e1-d0d5-4b66-8322-31849b525677", 3, 0, 0.0, 323.3333333333333, 189, 468, 313.0, 468.0, 468.0, 468.0, 0.04003576528365339, 0.032542091768646655, 0.025673977086197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 103.8, 101, 112, 103.0, 110.2, 112.0, 112.0, 0.07613556190582539, 0.05658121348665344, 0.03821648322226001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 157.66666666666669, 101, 307, 104.0, 306.4, 307.0, 307.0, 0.07613517546620106, 0.02037210749779208, 0.04342084225806779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 527.2222222222222, 500, 712, 504.0, 712.0, 712.0, 712.0, 0.05700171005130154, 16.7603953899867, 0.03250878776363291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 792.4444444444445, 698, 912, 705.0, 912.0, 912.0, 912.0, 0.056859821586515376, 51.16256741245167, 0.032372339829041474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 241.11111111111111, 103, 433, 303.0, 433.0, 433.0, 433.0, 0.05714575978462398, 0.10112120774388542, 0.031642232224493944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 115.39999999999999, 101, 310, 104.0, 114.0, 300.1999999999999, 310.0, 0.10575296108291032, 0.07859180017978003, 0.05308302929357022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 122.95, 101, 303, 103.0, 283.2000000000004, 303.0, 303.0, 0.10575407946361531, 0.028297478293975192, 0.060312873444093106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 133.9, 101, 308, 103.0, 304.8, 307.85, 308.0, 0.10575352027030599, 0.028503878510355914, 0.062171503127660364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 142.85, 101, 307, 103.0, 304.0, 306.85, 307.0, 0.10575407946361531, 0.028504029230427566, 0.062275107340390656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 104.55555555555556, 102, 115, 103.0, 115.0, 115.0, 115.0, 0.0571432199569521, 0.042466787487539605, 0.03208725730004635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13c5e44b-d931-4100-90d7-b53afa7872f1", 3, 0, 0.0, 310.3333333333333, 194, 529, 208.0, 529.0, 529.0, 529.0, 0.02604731929672238, 0.026123629802474495, 0.01670352181462991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 562.5, 102, 1017, 706.0, 943.5000000000001, 1017.0, 1017.0, 0.09206619559463254, 51.785133413267886, 0.049179891592054686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 130.13333333333335, 102, 307, 103.0, 305.8, 307.0, 307.0, 0.07613594834937264, 0.020521017328541846, 0.0447596102600804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 514.6874999999999, 102, 817, 709.0, 811.4, 817.0, 817.0, 0.09206672535920409, 16.92847692146133, 0.04927008349301156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 117.13333333333333, 101, 302, 103.0, 187.40000000000006, 302.0, 302.0, 0.07613633479684288, 0.020521121488211558, 0.044834189338375255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bebf17c1-dbf8-4b62-9957-f8ef7542147c", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 458.25, 108, 923, 420.0, 810.3000000000001, 923.0, 923.0, 0.08640381904880196, 0.01684410388439169, 0.05880142714807995], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/48c2248f-f529-423f-8603-b53e7171c9b0", 3, 0, 0.0, 255.66666666666666, 185, 371, 211.0, 371.0, 371.0, 371.0, 0.02616499646772548, 0.026241651730814518, 0.01677898536504531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 270.54999999999995, 204, 615, 212.0, 412.0, 604.8499999999999, 615.0, 0.10569427929713304, 0.163805489496631, 0.23770891134892325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fabd55e-a365-44ac-8551-b9bc2c7331f5", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 479.7083333333333, 108, 986, 443.5, 849.5, 956.25, 986.0, 0.1081426942851092, 0.06642749482942743, 0.048896550248052305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 104.75, 102, 113, 103.0, 110.9, 113.0, 113.0, 0.09217226997257875, 0.06849911860266839, 0.04626615895107957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 192.62500000000003, 101, 312, 104.5, 312.0, 312.0, 312.0, 0.09217333195073335, 0.11118858231654626, 0.04772940358093394], "isController": false}, {"data": ["login", 24, 0, 0.0, 2360.333333333333, 1411, 3427, 2439.0, 3251.5, 3406.75, 3427.0, 0.10377346253129419, 46.69409316181526, 0.22110132019301865], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bdc4fe29-46b6-47f7-9294-988e7cc635bf", 3, 0, 0.0, 429.33333333333337, 193, 702, 393.0, 702.0, 702.0, 702.0, 0.03345040976751965, 0.02788623027819591, 0.021450946367843005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 129.26666666666668, 103, 437, 105.0, 250.4000000000001, 437.0, 437.0, 0.07717438839297198, 0.0624780937282947, 0.02743308337406426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=871262d2-834a-4c2e-9d3e-48e1106c2bd1", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb5794a-ff5a-4634-8cfa-11c6800726e9", 3, 0, 0.0, 921.3333333333334, 194, 1907, 663.0, 1907.0, 1907.0, 1907.0, 0.02622950819672131, 0.026306352459016392, 0.016820355191256832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdb89f45-9393-4d3e-8090-71e727faa3ab", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 675.8750000000001, 207, 1121, 817.5, 1049.6000000000001, 1121.0, 1121.0, 0.09201113334713501, 68.85178956263083, 0.1922215009891197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725845ad-3815-477a-a609-b6ecf2929648", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6da05e1d-3d7f-40b7-8cf5-82dbc8a989b5", 3, 0, 0.0, 491.33333333333337, 223, 984, 267.0, 984.0, 984.0, 984.0, 0.049075740225748406, 0.03187047583019794, 0.031471096433829546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 324.71428571428567, 205, 812, 219.0, 417.8, 772.6999999999994, 812.0, 0.09786377362711106, 5.7196424244118855, 0.21890556990502552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c15ba82-f0b5-4cda-8eef-449147bc54ac", 3, 0, 0.0, 457.0, 200, 907, 264.0, 907.0, 907.0, 907.0, 0.02733659550039638, 0.02741668318252645, 0.017530303755137002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, 35.714285714285715, 614.3571428571428, 101, 1019, 807.0, 1018.0, 1019.0, 1019.0, 0.0828598484848485, 63.73382337165601, 0.139617919921875], "isController": false}, {"data": ["register", 24, 9, 37.5, 922.8333333333334, 272, 1707, 1019.0, 1339.5, 1618.25, 1707.0, 0.10467185373852972, 0.03255662638254073, 0.04722499651093821], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 134.75, 105, 313, 108.0, 311.6, 313.0, 313.0, 0.0790662278491021, 0.06138442494144158, 0.028105573180735515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 289.99999999999994, 206, 414, 216.0, 411.6, 414.0, 414.0, 0.07609500715293067, 0.11793239878095797, 0.17113945456367122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13c5e44b-d931-4100-90d7-b53afa7872f1", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36409d6b-7418-4900-98c7-caf4eb5b199d", 3, 0, 0.0, 295.0, 179, 400, 306.0, 400.0, 400.0, 400.0, 0.052878344555293125, 0.033995680500229136, 0.03390961548630451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 338.7894736842105, 206, 1008, 210.0, 470.0, 1008.0, 1008.0, 0.10721742565317985, 6.9084371120422094, 0.23969068301732407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 139.1, 102, 309, 104.0, 303.8, 309.0, 309.0, 0.04565105248501504, 0.0339262216221645, 0.022914688454392318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 122.5, 100, 303, 102.5, 283.20000000000005, 303.0, 303.0, 0.04565146929253918, 0.01221533455679271, 0.02603560358090125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 166.8, 101, 339, 104.0, 335.6, 339.0, 339.0, 0.04560941013349875, 0.012293161325044584, 0.02681334462926391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 186.89999999999998, 101, 338, 104.0, 334.8, 338.0, 338.0, 0.045651677699155443, 0.01230455375485049, 0.026882775051358138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 110.0, 108, 112, 110.0, 112.0, 112.0, 112.0, 0.11603620329542817, 0.034221614643768855, 0.07172941082617776], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 961.2166666666666, 804, 1564, 816.5, 1332.5, 1340.75, 1564.0, 0.2659562679243443, 318.17615779628636, 0.525159739983422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbaf34ab-a30f-443f-84a7-daa3145de9a5", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 922.8333333333334, 272, 1707, 1019.0, 1339.5, 1618.25, 1707.0, 0.1044340977329098, 0.03248267590618337, 0.04711772768809016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.11620475277438848, 0.031320812271221896, 0.06842916594038696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 102.5, 101, 104, 102.5, 104.0, 104.0, 104.0, 0.11620475277438848, 0.031320812271221896, 0.06831568473650573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 253.125, 101, 899, 103.5, 764.6000000000001, 899.0, 899.0, 0.07893438579181056, 13.334529746854958, 0.04513289343857918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 253.8125, 102, 710, 106.5, 707.9, 710.0, 710.0, 0.07893438579181056, 4.369035597557968, 0.045209977799703996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 130.31250000000003, 102, 311, 104.5, 306.1, 311.0, 311.0, 0.07893399637890292, 0.05866090941830578, 0.039621166151129004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 205.5, 103, 308, 205.5, 308.0, 308.0, 308.0, 0.11621150493898896, 0.031095656595002904, 0.06627687391051713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 166.49999999999997, 101, 306, 105.0, 305.3, 306.0, 306.0, 0.07893477520856047, 0.043350531453041206, 0.04377449753082156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 104.5, 104, 105, 104.5, 105.0, 105.0, 105.0, 0.11619125079881484, 0.0863491619706036, 0.058322561436123854], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 659.9375, 102, 1628, 561.0, 1325.6000000000004, 1628.0, 1628.0, 0.08462295186011827, 0.016207691829653998, 0.05758947224367179], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb5794a-ff5a-4634-8cfa-11c6800726e9", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 121.0, 106, 136, 121.0, 136.0, 136.0, 136.0, 0.08805529872760093, 0.06930915114692027, 0.031300906969576894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1272.8749999999998, 794, 2078, 1235.5, 1659.0, 1977.0, 2078.0, 0.10510273792632298, 0.05439887802827263, 0.04834315387040832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 311.0, 208, 414, 311.0, 414.0, 414.0, 414.0, 0.11549344574695386, 0.17899228359415603, 0.25974746636253393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdc4fe29-46b6-47f7-9294-988e7cc635bf", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["addBook", 59, 19, 32.20338983050848, 972.9322033898308, 527, 2585, 830.0, 1454.0, 1732.0, 2585.0, 0.27957447816712866, 86.19594998311892, 1.0140405471841163], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 180.4666666666666, 101, 704, 104.0, 420.0, 424.0, 704.0, 0.2667935418176644, 0.1982713723859791, 0.12896758124974989], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 584.7, 499, 835, 508.0, 734.9, 811.9, 835.0, 0.26706667319496313, 78.52646936745258, 0.13431575849160743], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 162.01666666666674, 101, 429, 105.0, 319.09999999999997, 406.14999999999964, 429.0, 0.2675477907241181, 0.47343417655478715, 0.13011601541075277], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 772.7166666666667, 696, 1013, 709.0, 911.8, 927.0, 1013.0, 0.26682913596278623, 240.0933255749056, 0.13393571863757042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 107.84210526315789, 104, 124, 106.0, 118.0, 124.0, 124.0, 0.10543606135268918, 0.07876815130352267, 0.03747922493396373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=004bc7e1-d0d5-4b66-8322-31849b525677", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 19, 10.674157303370787, 167.15168539325848, 103, 1277, 109.0, 312.0, 377.9499999999997, 1249.3500000000004, 0.7238685487248934, 1.6647483387623474, 0.34340785900626675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 127.99999999999999, 104, 307, 108.0, 287.50000000000006, 307.0, 307.0, 0.045882925128242776, 0.03553238244794582, 0.01630994604168005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bebf17c1-dbf8-4b62-9957-f8ef7542147c", 3, 0, 0.0, 649.0, 324, 1125, 498.0, 1125.0, 1125.0, 1125.0, 0.08165709464057269, 0.036947708838019545, 0.05236473842510684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48c2248f-f529-423f-8603-b53e7171c9b0", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 106.38095238095238, 104, 116, 106.0, 111.2, 115.6, 116.0, 0.09915529135129775, 0.08046684288371918, 0.035246607472531624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 347.8, 207, 648, 386.0, 624.3000000000001, 648.0, 648.0, 0.04558778612034264, 0.07065216462205445, 0.1025279994483878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 435.75, 206, 1001, 407.0, 874.3000000000002, 1001.0, 1001.0, 0.0788935184043786, 17.796358224341116, 0.17364856327506717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d51a2f6-298e-4cb3-803b-f1e7d78a2f64", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6da05e1d-3d7f-40b7-8cf5-82dbc8a989b5", 1, 0, 0.0, 923.0, 923, 923, 923.0, 923.0, 923.0, 923.0, 1.0834236186348862, 0.19573571235102924, 0.7469697995666306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 117.8, 103, 319, 105.0, 137.00000000000006, 310.04999999999984, 319.0, 0.10353360183047408, 0.08583987104889891, 0.03680296002567633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/871262d2-834a-4c2e-9d3e-48e1106c2bd1", 3, 0, 0.0, 350.3333333333333, 209, 593, 249.0, 593.0, 593.0, 593.0, 0.07054839619979306, 0.03192131208258866, 0.045240996260935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 121.43750000000001, 103, 308, 107.0, 183.40000000000012, 308.0, 308.0, 0.08659180083885808, 0.06722703287782437, 0.03078067920443783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c15ba82-f0b5-4cda-8eef-449147bc54ac", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.2660737297496318, 1.0153948821796759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fabd55e-a365-44ac-8551-b9bc2c7331f5", 3, 0, 0.0, 739.0, 201, 1628, 388.0, 1628.0, 1628.0, 1628.0, 0.06849471449119843, 0.03099207459074408, 0.0439240193840042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 106.47368421052632, 102, 163, 103.0, 105.0, 163.0, 163.0, 0.1072809915022162, 0.07972737747381498, 0.053850028937635866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 156.10526315789474, 101, 309, 103.0, 306.0, 309.0, 309.0, 0.10728038575768184, 0.03718641660926225, 0.060709140994658566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 199.05263157894737, 101, 905, 103.0, 327.0, 905.0, 905.0, 0.1072809915022162, 5.108005535205105, 0.06258425439710906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 182.05263157894734, 101, 606, 103.0, 305.0, 606.0, 606.0, 0.1072809915022162, 1.687613368481974, 0.06268902099037295], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6474820143884892], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.2158273381294964], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.2631578947368425, 0.14388489208633093], "isController": false}, {"data": ["401/Unauthorized", 24, 63.1578947368421, 1.7266187050359711], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1390, 38, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
