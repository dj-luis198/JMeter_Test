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

    var data = {"OkPercent": 98.07549962990377, "KoPercent": 1.924500370096225};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7782386726228462, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58200b48-843a-4e6d-8a54-721f21dbfb0f"], "isController": false}, {"data": [0.11206896551724138, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2923f485-529c-4508-be3b-a91b2bc0a333"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/181e0254-97b6-4f45-bf98-6999b2b8b639"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30a84679-177d-47dd-8ed2-1626500e9be4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5999247b-ac01-485d-a80d-af654ebce70f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3b87558-d0a9-4ab4-9296-801ed16cce1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/618db72a-82f2-4a33-8d5a-6594235f9c3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3beed788-081c-4391-9d2a-2456845f0e86"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=618db72a-82f2-4a33-8d5a-6594235f9c3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1d82ab3-d76e-4d6b-ad9d-477c53d8de07"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=849aa643-1895-4d20-8dde-50021aa093f5"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c14ea82e-79fc-4983-9c28-d7121e9220b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58200b48-843a-4e6d-8a54-721f21dbfb0f"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22fa6b67-1773-41b3-aaf2-162934278238"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd92d5d0-8810-4efd-a33e-de54c5e9fe4e"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c14ea82e-79fc-4983-9c28-d7121e9220b9"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3041d32b-4916-42f7-af13-174ba839a04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3b87558-d0a9-4ab4-9296-801ed16cce1d"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3beed788-081c-4391-9d2a-2456845f0e86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/849aa643-1895-4d20-8dde-50021aa093f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5999247b-ac01-485d-a80d-af654ebce70f"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=181e0254-97b6-4f45-bf98-6999b2b8b639"], "isController": false}, {"data": [0.5689655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd92d5d0-8810-4efd-a33e-de54c5e9fe4e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2923f485-529c-4508-be3b-a91b2bc0a333"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3041d32b-4916-42f7-af13-174ba839a04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 26, 1.924500370096225, 368.63064396743135, 97, 2663, 117.0, 1019.8, 1234.799999999999, 1752.88, 5.374590242194711, 755.4460663126373, 3.9421589748396775], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58200b48-843a-4e6d-8a54-721f21dbfb0f", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1696.396551724138, 1244, 2242, 1728.0, 1957.0, 2110.45, 2242.0, 0.24898688096709937, 299.6139269591082, 1.2242665485052202], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2923f485-529c-4508-be3b-a91b2bc0a333", 1, 0, 0.0, 1581.0, 1581, 1581, 1581.0, 1581.0, 1581.0, 1581.0, 0.6325110689437066, 0.1142720192915876, 0.4360867330803289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/181e0254-97b6-4f45-bf98-6999b2b8b639", 3, 0, 0.0, 419.6666666666667, 294, 523, 442.0, 523.0, 523.0, 523.0, 0.019187965308158722, 0.026452159205746152, 0.012304782440453346], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 784.1538461538461, 109, 2663, 512.0, 2607.4, 2663.0, 2663.0, 0.07585305512766653, 0.015037275577066704, 0.05099795999043085], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 784.1538461538461, 109, 2663, 512.0, 2607.4, 2663.0, 2663.0, 0.07465729430479702, 0.014800225335814253, 0.05019401923286759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30a84679-177d-47dd-8ed2-1626500e9be4", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 156.33333333333334, 100, 307, 103.0, 306.4, 307.0, 307.0, 0.1272944830571043, 0.059553265315647884, 0.07117220185510494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5999247b-ac01-485d-a80d-af654ebce70f", 3, 0, 0.0, 383.0, 212, 498, 439.0, 498.0, 498.0, 498.0, 0.03571343539439537, 0.035818064599652394, 0.022902170484036095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3b87558-d0a9-4ab4-9296-801ed16cce1d", 1, 0, 0.0, 1206.0, 1206, 1206, 1206.0, 1206.0, 1206.0, 1206.0, 0.8291873963515755, 0.1498043635986733, 0.5716858416252073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 104.8, 102, 111, 105.0, 109.2, 111.0, 111.0, 0.12728908199114067, 0.0945966712844317, 0.06389315248383429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 220.93333333333334, 100, 805, 103.0, 787.6, 805.0, 805.0, 0.1272944830571043, 5.020242474774476, 0.07350096160374076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 249.40000000000003, 100, 1111, 103.0, 1098.4, 1111.0, 1111.0, 0.1272944830571043, 15.301708477600414, 0.0733766505851303], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 267.2857142857143, 103, 442, 217.5, 426.0, 442.0, 442.0, 0.0719609354921614, 0.13811921742482652, 0.04650656161655101], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 117.17647058823528, 100, 320, 105.0, 154.39999999999986, 320.0, 320.0, 0.11475011475011475, 0.08527816145003646, 0.057599178692928694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 139.64705882352945, 100, 321, 104.0, 309.0, 321.0, 321.0, 0.11459850078196625, 0.040788850577037156, 0.06479081139109098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 761.1428571428571, 605, 915, 787.0, 915.0, 915.0, 915.0, 0.07079144839303413, 20.815036324861957, 0.04037324791165227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1105.2857142857144, 860, 1315, 1135.0, 1315.0, 1315.0, 1315.0, 0.07053536340826876, 63.46784398270372, 0.04015831725294989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 104.42857142857142, 101, 109, 104.0, 109.0, 109.0, 109.0, 0.0713092376023797, 0.12618392435108594, 0.03948470480522391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 123.18181818181819, 101, 306, 104.0, 267.0000000000001, 306.0, 306.0, 0.09728658860154951, 0.07229989641189373, 0.048833307169137155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 157.63636363636365, 99, 313, 102.0, 311.6, 313.0, 313.0, 0.09728744903464318, 0.02603199319872288, 0.05548424827756994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 175.54545454545456, 98, 313, 104.0, 312.0, 313.0, 313.0, 0.09746329620867779, 0.026269404056245182, 0.05729775812267971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 212.27272727272725, 99, 317, 293.0, 315.2, 317.0, 317.0, 0.0972986360500292, 0.02622502299785943, 0.0572959741583668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/618db72a-82f2-4a33-8d5a-6594235f9c3b", 3, 0, 0.0, 490.6666666666667, 410, 600, 462.0, 600.0, 600.0, 600.0, 0.08397950899980405, 0.03799854085603113, 0.05385404711250455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 136.28571428571428, 102, 309, 105.0, 309.0, 309.0, 309.0, 0.07129471196936364, 0.05298366778191966, 0.040033651740609466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 589.6, 100, 1284, 567.0, 1221.7, 1280.8999999999999, 1284.0, 0.09841405746396815, 44.289833781732376, 0.05362797271962327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 175.2941176470588, 100, 1117, 103.0, 463.3999999999994, 1117.0, 1117.0, 0.11459850078196625, 6.094714028288977, 0.06679207197459958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 485.95, 100, 1012, 457.5, 917.7, 1007.3, 1012.0, 0.09841454173268642, 14.48183436709608, 0.05372434455915206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 189.47058823529414, 97, 782, 103.0, 405.99999999999966, 782.0, 782.0, 0.11475398770107262, 2.0139034792396537, 0.06699475970852486], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 628.0, 104, 1581, 487.0, 1430.9999999999998, 1581.0, 1581.0, 0.07480722752905973, 0.014829948426171021, 0.050755624928069974], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3beed788-081c-4391-9d2a-2456845f0e86", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 374.3636363636363, 207, 620, 406.0, 580.0000000000001, 620.0, 620.0, 0.0970240090320532, 0.1503682639979184, 0.21820927031329934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=618db72a-82f2-4a33-8d5a-6594235f9c3b", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1d82ab3-d76e-4d6b-ad9d-477c53d8de07", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 547.2380952380952, 153, 1282, 451.0, 1088.6000000000001, 1268.6999999999998, 1282.0, 0.09225173301469879, 0.0566663477209429, 0.04171147693926321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 124.35000000000001, 100, 299, 105.0, 281.0000000000004, 299.0, 299.0, 0.09840921503889624, 0.07313419203574223, 0.04939681301757096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 165.45000000000002, 100, 313, 103.5, 313.0, 313.0, 313.0, 0.09841357320001574, 0.10023960629650042, 0.051993889747273946], "isController": false}, {"data": ["login", 21, 0, 0.0, 2907.0476190476197, 1829, 4907, 2824.0, 3794.4, 4797.5999999999985, 4907.0, 0.09269845193585267, 37.09117930777431, 0.19110003128572753], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 122.05882352941177, 105, 319, 109.0, 157.39999999999986, 319.0, 319.0, 0.10879164480167923, 0.08807448587948445, 0.03867202998809691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=849aa643-1895-4d20-8dde-50021aa093f5", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 730.25, 204, 1390, 800.5, 1326.8, 1386.85, 1390.0, 0.09835888205294659, 58.91192753593788, 0.2086284099794922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c14ea82e-79fc-4983-9c28-d7121e9220b9", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58200b48-843a-4e6d-8a54-721f21dbfb0f", 3, 0, 0.0, 452.6666666666667, 402, 513, 443.0, 513.0, 513.0, 513.0, 0.04339649934905251, 0.02789976764790974, 0.02782913532475047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 409.3333333333333, 203, 1215, 213.0, 1203.0, 1215.0, 1215.0, 0.1271800785125018, 20.45770222427359, 0.2816922819709521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22fa6b67-1773-41b3-aaf2-162934278238", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.7159998598654709, 1.3378468329596411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 786.6666666666667, 103, 1490, 976.0, 1474.7, 1490.0, 1490.0, 0.11076139227070085, 77.30934257921747, 0.1761113348132286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd92d5d0-8810-4efd-a33e-de54c5e9fe4e", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1097.391304347826, 157, 2239, 1074.0, 1725.2, 2142.3999999999987, 2239.0, 0.0910710750346466, 0.02841330924569392, 0.0410887076816472], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c14ea82e-79fc-4983-9c28-d7121e9220b9", 3, 0, 0.0, 312.6666666666667, 223, 465, 250.0, 465.0, 465.0, 465.0, 0.026404499326685267, 0.026481856258306416, 0.016932572810406894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 353.6470588235294, 205, 1223, 217.0, 746.1999999999996, 1223.0, 1223.0, 0.11451744370120377, 8.226020594614985, 0.25582886420588885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 121.81250000000001, 103, 310, 109.0, 180.5000000000001, 310.0, 310.0, 0.11012003083360863, 0.08549357862570202, 0.03914422971038432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3041d32b-4916-42f7-af13-174ba839a04f", 3, 0, 0.0, 600.0, 390, 933, 477.0, 933.0, 933.0, 933.0, 0.02455453972515285, 0.024626476853253886, 0.015746238039892942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 279.5882352941176, 203, 415, 211.0, 415.0, 415.0, 415.0, 0.11032012303938428, 0.1709746438120145, 0.24811254234345897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 137.75, 101, 314, 105.0, 309.20000000000005, 314.0, 314.0, 0.056147180475753775, 0.04172656674028186, 0.028183252699743595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 118.91666666666664, 99, 297, 102.5, 241.5000000000002, 297.0, 297.0, 0.05614901949774702, 0.015024249357795588, 0.032022487682308844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 119.75, 100, 302, 103.0, 244.4000000000002, 302.0, 302.0, 0.05614823133071308, 0.015133702975856261, 0.033009018809657495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 152.58333333333331, 100, 306, 103.0, 304.8, 306.0, 306.0, 0.05614823133071308, 0.015133702975856261, 0.0330638510668164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 104, 108, 106.0, 108.0, 108.0, 108.0, 0.21208907741251323, 0.06254970837751855, 0.13110584570519618], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1155.4827586206895, 797, 1748, 1103.5, 1514.6, 1670.6999999999998, 1748.0, 0.25440158606230207, 304.3527412319178, 0.502343756853491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1097.391304347826, 157, 2239, 1074.0, 1725.2, 2142.3999999999987, 2239.0, 0.09354993532852297, 0.029186690081266422, 0.04220709972829845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 156.72727272727275, 100, 307, 103.0, 306.8, 307.0, 307.0, 0.04854840275754928, 0.013085311680745703, 0.028588561389455286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 177.8181818181818, 101, 310, 105.0, 309.8, 310.0, 310.0, 0.048548617026441344, 0.013085369432908018, 0.028541276806560243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 184.5, 101, 1217, 102.5, 575.8000000000006, 1217.0, 1217.0, 0.10927543556505645, 6.173001636143533, 0.06365507550249626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 184.93749999999997, 100, 608, 103.5, 398.7000000000002, 608.0, 608.0, 0.10912116541404662, 2.032901203572354, 0.0636717737645438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 121.54545454545455, 99, 312, 102.0, 271.0000000000001, 312.0, 312.0, 0.04854818849054855, 0.01299043324844756, 0.02768763874851597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 102.875, 100, 106, 103.5, 104.6, 106.0, 106.0, 0.10927543556505645, 0.08120957662598433, 0.05485114636761622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 122.18181818181819, 101, 302, 105.0, 263.0000000000001, 302.0, 302.0, 0.04854690292826092, 0.03607831360195953, 0.024368269633912216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 177.1875, 99, 309, 103.0, 308.3, 309.0, 309.0, 0.10912190963341858, 0.03944213554987212, 0.06166080562659847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 131.8181818181818, 106, 320, 110.0, 282.20000000000016, 320.0, 320.0, 0.04743137542364842, 0.03733368026509827, 0.016860371732625026], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 560.3076923076924, 104, 1343, 498.0, 1178.9999999999998, 1343.0, 1343.0, 0.07496813854112003, 0.014546477002081807, 0.05101685449549326], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1600.142857142857, 1144, 2629, 1417.0, 2345.4, 2603.3999999999996, 2629.0, 0.09200881532078216, 0.047621750117201704, 0.04232046095321133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3b87558-d0a9-4ab4-9296-801ed16cce1d", 3, 0, 0.0, 585.6666666666667, 200, 1343, 214.0, 1343.0, 1343.0, 1343.0, 0.054479089109630084, 0.03502480501026023, 0.03493613461782919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 302.09090909090907, 206, 615, 215.0, 575.2000000000002, 615.0, 615.0, 0.04852505878149166, 0.0752043635607688, 0.10913399450563993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3beed788-081c-4391-9d2a-2456845f0e86", 3, 0, 0.0, 351.0, 208, 427, 418.0, 427.0, 427.0, 427.0, 0.030415475393880405, 0.030504583231948414, 0.019504715665997527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/849aa643-1895-4d20-8dde-50021aa093f5", 3, 0, 0.0, 1135.0, 205, 2530, 670.0, 2530.0, 2530.0, 2530.0, 0.016806911001803943, 0.023169683623906152, 0.010777869359880784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5999247b-ac01-485d-a80d-af654ebce70f", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 1116.9836065573768, 524, 3820, 908.0, 1848.6000000000001, 1960.3, 3820.0, 0.2881286281770905, 80.21836076065958, 1.0498262519425066], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 177.7931034482759, 101, 439, 106.0, 419.2, 422.0, 439.0, 0.255639495420527, 0.18998208595216898, 0.12357573264957114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=181e0254-97b6-4f45-bf98-6999b2b8b639", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 642.9827586206895, 490, 974, 598.5, 862.2, 931.4999999999999, 974.0, 0.2552648372686662, 75.05633774728781, 0.12838026483726867], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 143.70689655172416, 99, 321, 106.0, 306.2, 309.1, 321.0, 0.2560615960584174, 0.45310899615024636, 0.1245299558955975], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 976.051724137931, 690, 1324, 976.5, 1207.2, 1225.7499999999998, 1324.0, 0.25493384906157973, 229.389925511516, 0.12796484220473825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 122.58823529411765, 105, 307, 108.0, 173.39999999999986, 307.0, 307.0, 0.1146796726907224, 0.08567377891445571, 0.04076503990178023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, 5.0, 205.08333333333326, 101, 2203, 112.0, 381.6, 443.95, 2048.2899999999995, 0.7445461990916536, 1.5840592012467012, 0.35806645359202177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 142.83333333333334, 103, 310, 108.0, 309.4, 310.0, 310.0, 0.05538810909611221, 0.042893330579313466, 0.01968874190525864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 123.46666666666667, 103, 302, 110.0, 193.40000000000006, 302.0, 302.0, 0.11987053981699763, 0.09727775252727054, 0.042610230950573376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd92d5d0-8810-4efd-a33e-de54c5e9fe4e", 3, 0, 0.0, 446.3333333333333, 362, 565, 412.0, 565.0, 565.0, 565.0, 0.03419894667244249, 0.028510254696655343, 0.02193096515127334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 292.16666666666663, 204, 616, 210.0, 611.2, 616.0, 616.0, 0.056120396958274484, 0.08697565427029454, 0.12621608808096302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 352.375, 203, 1322, 209.0, 686.4000000000007, 1322.0, 1322.0, 0.10904456515072004, 8.311886038632444, 0.24350002811305194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 108.18181818181819, 104, 129, 106.0, 125.00000000000001, 129.0, 129.0, 0.10497285020374277, 0.08703315412400156, 0.037314567845861686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2923f485-529c-4508-be3b-a91b2bc0a333", 3, 0, 0.0, 353.3333333333333, 231, 454, 375.0, 454.0, 454.0, 454.0, 0.01967625993651127, 0.023256673121573052, 0.012617914086890366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3041d32b-4916-42f7-af13-174ba839a04f", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 109.25, 104, 123, 108.0, 121.7, 122.95, 123.0, 0.09748013842179656, 0.07568038090364089, 0.034651142954622995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 103.17647058823529, 100, 106, 103.0, 105.2, 106.0, 106.0, 0.11039462832726163, 0.08204132046586533, 0.0554129286720825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 150.0, 100, 308, 103.0, 306.4, 308.0, 308.0, 0.11039462832726163, 0.029539187657880554, 0.0629594364678914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 150.64705882352942, 99, 309, 103.0, 308.2, 309.0, 309.0, 0.11039391145109549, 0.029754608945803084, 0.0648995455991792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 138.41176470588232, 100, 311, 103.0, 304.6, 311.0, 311.0, 0.11039391145109549, 0.029754608945803084, 0.06500735215333064], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.5921539600296077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.22205773501110287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 0.9622501850481125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 26, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
