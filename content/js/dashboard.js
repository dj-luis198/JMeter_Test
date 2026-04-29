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

    var data = {"OkPercent": 97.66173031956352, "KoPercent": 2.338269680436477};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.719626168224299, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05ee0932-d84f-401e-95bc-0b73e558b88d"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f7774b8-fb83-43ba-b866-a45ad228e478"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79942c83-6631-4f59-bc6c-86d4a63760b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6911a02d-32a8-4659-b2c1-0e66812faee3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2bc2e3df-408a-4964-8f04-f1f209a835f3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb8099e9-b629-45c0-a36e-5b380539d6d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/505a54ae-c849-4844-94d6-081abbf1dbee"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79942c83-6631-4f59-bc6c-86d4a63760b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f861d7e4-d9f7-4465-bfde-9c36f1c79bb1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6c73b54-6fcc-454d-a6a2-647bee7b4f57"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e7cd63b-6390-42ad-8940-c7e89a7c486a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40044f9f-0316-4ee2-aedd-f57dd9de5b85"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41d562e1-ae92-4d80-b6c5-14754219073c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/380c9aa3-d9cb-42fc-b58b-6196b158d21d"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e7cd63b-6390-42ad-8940-c7e89a7c486a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f20fe501-8652-4354-8df8-587eb47e469e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6c73b54-6fcc-454d-a6a2-647bee7b4f57"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f7774b8-fb83-43ba-b866-a45ad228e478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea7cc202-f98d-46ab-a055-47c18d33b5f5"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6911a02d-32a8-4659-b2c1-0e66812faee3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc2e3df-408a-4964-8f04-f1f209a835f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f861d7e4-d9f7-4465-bfde-9c36f1c79bb1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05ee0932-d84f-401e-95bc-0b73e558b88d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb8099e9-b629-45c0-a36e-5b380539d6d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40044f9f-0316-4ee2-aedd-f57dd9de5b85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f20fe501-8652-4354-8df8-587eb47e469e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41d562e1-ae92-4d80-b6c5-14754219073c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 30, 2.338269680436477, 473.7716289945436, 125, 2589, 156.0, 1330.6000000000001, 1592.6, 2091.760000000001, 4.971172623291281, 726.321083736458, 3.63423385991406], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2256.436363636363, 1575, 2929, 2258.0, 2670.4, 2749.399999999999, 2929.0, 0.2400195506834011, 288.82476046457964, 1.1801742555575436], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05ee0932-d84f-401e-95bc-0b73e558b88d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 685.5333333333332, 131, 2531, 560.0, 1748.0000000000005, 2531.0, 2531.0, 0.10196382323551603, 0.02075123121316557, 0.06832771045333116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 685.5333333333332, 131, 2531, 560.0, 1748.0000000000005, 2531.0, 2531.0, 0.10328871260948604, 0.021020866902164932, 0.06921554159436458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 226.13333333333335, 129, 425, 142.0, 423.8, 425.0, 425.0, 0.08511507558218712, 0.03982011283421853, 0.047589080019519725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 157.86666666666667, 128, 439, 138.0, 263.80000000000007, 439.0, 439.0, 0.08511555855666711, 0.06325482427892937, 0.04272402060363954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 346.73333333333335, 127, 1110, 144.0, 1072.2, 1110.0, 1110.0, 0.08511845651865513, 3.3569034614838986, 0.049148150446871895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 337.99999999999994, 129, 1589, 136.0, 1362.2, 1589.0, 1589.0, 0.08512038860294743, 10.23208029619058, 0.049066140669954204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f7774b8-fb83-43ba-b866-a45ad228e478", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 300.26666666666665, 129, 634, 254.0, 564.4000000000001, 634.0, 634.0, 0.10161913149515615, 0.17301715669670076, 0.0656753332260687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79942c83-6631-4f59-bc6c-86d4a63760b2", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6911a02d-32a8-4659-b2c1-0e66812faee3", 1, 0, 0.0, 782.0, 782, 782, 782.0, 782.0, 782.0, 782.0, 1.278772378516624, 0.23102821291560102, 0.8816536125319693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 157.18750000000003, 131, 400, 139.0, 239.00000000000017, 400.0, 400.0, 0.1122066847132418, 0.08338797565114942, 0.056322496037701446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 874.375, 659, 1122, 800.0, 1122.0, 1122.0, 1122.0, 0.03866994716718468, 11.370248430241833, 0.022053954243785017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 137.375, 128, 144, 136.0, 144.0, 144.0, 144.0, 0.11221219325744984, 0.03002552827396607, 0.06399601646713937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1323.0000000000002, 883, 1578, 1411.5, 1578.0, 1578.0, 1578.0, 0.038554588477961234, 34.691486484207076, 0.02195051277602676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 300.75, 132, 405, 394.0, 405.0, 405.0, 405.0, 0.03873735588493068, 0.06854696178075625, 0.02144929764331611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 156.07142857142858, 128, 397, 136.5, 274.5, 397.0, 397.0, 0.08491332775331464, 0.06310453361354731, 0.04262251021992552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 189.35714285714286, 128, 406, 134.5, 402.0, 406.0, 406.0, 0.08477603986896046, 0.03177918793636953, 0.04784027361466868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 247.7857142857143, 126, 1440, 134.5, 918.5, 1440.0, 1440.0, 0.08491126772522713, 5.478630648494645, 0.049397319533230635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 259.2857142857143, 129, 1083, 142.0, 740.0, 1083.0, 1083.0, 0.0847765532275645, 1.801726470721812, 0.04940173867627468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 135.25, 127, 144, 134.5, 144.0, 144.0, 144.0, 0.038785246092386455, 0.028823801051080167, 0.021778824710080285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1192.8461538461538, 135, 1855, 1581.0, 1841.0, 1855.0, 1855.0, 0.16891672405504085, 105.23893849238576, 0.08925482549603046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 203.375, 128, 432, 135.0, 415.90000000000003, 432.0, 432.0, 0.11221534123983926, 0.030245541193550423, 0.06597034709607737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 763.6153846153848, 135, 1291, 1044.0, 1230.2, 1291.0, 1291.0, 0.1689211138398368, 34.399835667368336, 0.08942210706350134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 153.81250000000003, 128, 422, 134.5, 233.7000000000002, 422.0, 422.0, 0.11221534123983926, 0.030245541193550423, 0.0660799323902569], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 633.6, 135, 1862, 538.0, 1428.2000000000003, 1862.0, 1862.0, 0.10312467773538209, 0.020987483242239865, 0.06962929901000309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2bc2e3df-408a-4964-8f04-f1f209a835f3", 3, 0, 0.0, 640.6666666666666, 366, 1035, 521.0, 1035.0, 1035.0, 1035.0, 0.02012909459332519, 0.023791908355587164, 0.01290830610314148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 462.8571428571429, 265, 1575, 288.0, 1184.5, 1575.0, 1575.0, 0.08470935614838658, 7.3606084381863734, 0.18896520714462914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb8099e9-b629-45c0-a36e-5b380539d6d4", 3, 0, 0.0, 361.0, 315, 408, 360.0, 408.0, 408.0, 408.0, 0.03090234857849197, 0.030992882802843017, 0.01981693577461887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/505a54ae-c849-4844-94d6-081abbf1dbee", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 663.4347826086957, 170, 1215, 657.0, 1188.2, 1211.0, 1215.0, 0.09641220830067196, 0.0592219521690651, 0.043592629339073354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 138.84615384615384, 128, 156, 137.0, 154.4, 156.0, 156.0, 0.16900895747474617, 0.1256013834358221, 0.08483457435744095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 180.53846153846152, 131, 426, 140.0, 408.0, 426.0, 426.0, 0.1689386752608803, 0.22086904328728674, 0.08652523196579642], "isController": false}, {"data": ["login", 23, 0, 0.0, 2935.5217391304345, 1700, 4342, 2905.0, 3974.0, 4275.599999999999, 4342.0, 0.09657251546209948, 40.31526104233235, 0.20140732791197624], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/79942c83-6631-4f59-bc6c-86d4a63760b2", 3, 0, 0.0, 302.0, 229, 430, 247.0, 430.0, 430.0, 430.0, 0.09213476244587082, 0.04276828491139707, 0.059083815761186695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 145.87499999999997, 136, 171, 144.0, 158.4, 171.0, 171.0, 0.11520488468711074, 0.0932664544976707, 0.04095173635362139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f861d7e4-d9f7-4465-bfde-9c36f1c79bb1", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6c73b54-6fcc-454d-a6a2-647bee7b4f57", 3, 0, 0.0, 541.3333333333333, 225, 1078, 321.0, 1078.0, 1078.0, 1078.0, 0.026493341340209826, 0.03131423255413473, 0.016989545065173618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1332.8461538461538, 273, 1995, 1715.0, 1978.6, 1995.0, 1995.0, 0.1686231273104611, 139.74094461378817, 0.34936857529671184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e7cd63b-6390-42ad-8940-c7e89a7c486a", 3, 0, 0.0, 441.3333333333333, 227, 634, 463.0, 634.0, 634.0, 634.0, 0.04697335045250994, 0.0301993382629255, 0.030122884242006702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40044f9f-0316-4ee2-aedd-f57dd9de5b85", 1, 0, 0.0, 1862.0, 1862, 1862, 1862.0, 1862.0, 1862.0, 1862.0, 0.5370569280343717, 0.09702688641245971, 0.3702755773361976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 891.2857142857142, 129, 1722, 1163.5, 1676.5, 1722.0, 1722.0, 0.06607264215057011, 45.176634442488485, 0.10389757059153892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 623.1333333333333, 266, 1725, 536.0, 1500.0000000000002, 1725.0, 1725.0, 0.0850470310081475, 13.680340944688247, 0.18837142200053297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41d562e1-ae92-4d80-b6c5-14754219073c", 3, 0, 0.0, 782.0, 254, 1418, 674.0, 1418.0, 1418.0, 1418.0, 0.03376667229444538, 0.028149885334008667, 0.021653757949237438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/380c9aa3-d9cb-42fc-b58b-6196b158d21d", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1247.3478260869565, 475, 2265, 1156.0, 1993.2000000000007, 2259.6, 2265.0, 0.1017082564993787, 0.03173200869384488, 0.04588790478780562], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 367.375, 263, 823, 283.5, 644.5000000000002, 823.0, 823.0, 0.11210291047181313, 0.17373761613160882, 0.2521220730630719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 162.99999999999997, 131, 428, 142.0, 273.3000000000002, 428.0, 428.0, 0.12851405622489961, 0.09977409638554217, 0.04568273092369478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e7cd63b-6390-42ad-8940-c7e89a7c486a", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.15861638498683056, 0.6053144205443372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 547.5, 266, 1744, 540.5, 1428.1000000000013, 1744.0, 1744.0, 0.08530421616088375, 8.625646057256901, 0.1900323578440781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 160.20000000000005, 128, 481, 136.0, 280.0000000000001, 481.0, 481.0, 0.074513427319603, 0.055375701357634644, 0.03740224769753509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 158.26666666666668, 128, 445, 138.0, 267.4000000000001, 445.0, 445.0, 0.07451897998420198, 0.019939648941085294, 0.04249910577224019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 173.8, 128, 422, 135.0, 420.8, 422.0, 422.0, 0.07451823958110813, 0.020084994262095552, 0.0438085744412374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 136.73333333333332, 127, 145, 138.0, 143.8, 145.0, 145.0, 0.07451712900405373, 0.02008469492687386, 0.0438806921771918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 218.66666666666666, 135, 383, 138.0, 383.0, 383.0, 383.0, 0.0384487222207982, 0.011339369248711968, 0.023767618325942635], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1541.8727272727278, 1019, 2363, 1522.0, 2071.0, 2181.3999999999996, 2363.0, 0.24482637358724052, 292.8974582292821, 0.4834364525326175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1247.3478260869565, 475, 2265, 1156.0, 1993.2000000000007, 2259.6, 2265.0, 0.09744606572101616, 0.030402245708136325, 0.04396492418272409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 289.8888888888889, 134, 423, 399.0, 423.0, 423.0, 423.0, 0.03980433955755266, 0.010728513396371613, 0.023439469485551024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 169.55555555555554, 133, 422, 140.0, 422.0, 422.0, 422.0, 0.03985175148447774, 0.010741292392300643, 0.0234284710875543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f20fe501-8652-4354-8df8-587eb47e469e", 3, 0, 0.0, 545.3333333333334, 518, 560, 558.0, 560.0, 560.0, 560.0, 0.05885122410546139, 0.026053927338355307, 0.0377398800415882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6c73b54-6fcc-454d-a6a2-647bee7b4f57", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 361.6875, 127, 1636, 140.0, 1531.7, 1636.0, 1636.0, 0.12520541513420455, 14.112035003717034, 0.07226210971124501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 323.1875, 125, 1194, 140.0, 1061.7, 1194.0, 1194.0, 0.12520541513420455, 4.631347083105094, 0.07238438062446201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 220.44444444444446, 129, 429, 134.0, 429.0, 429.0, 429.0, 0.03985175148447774, 0.010663456940182522, 0.022727952018491215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 156.375, 126, 404, 137.0, 250.70000000000016, 404.0, 404.0, 0.12493948243819401, 0.09285053333541565, 0.0627137636457341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 196.77777777777777, 129, 420, 135.0, 420.0, 420.0, 420.0, 0.03985157502280396, 0.02961625839097052, 0.020003622618868393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 133.18750000000003, 125, 143, 134.0, 143.0, 143.0, 143.0, 0.1252103141996322, 0.05701104394099464, 0.07009454356927652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 174.77777777777777, 136, 435, 144.0, 435.0, 435.0, 435.0, 0.04030307915524746, 0.03172293144446236, 0.01432648516846687], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 454.78571428571433, 130, 1078, 455.5, 876.0, 1078.0, 1078.0, 0.09600351098554462, 0.01913239612762981, 0.06532604978124915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1490.5652173913043, 824, 2589, 1330.0, 2439.8, 2572.6, 2589.0, 0.0951364587728224, 0.04924054995077722, 0.04375905476757749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 489.2222222222223, 270, 850, 539.0, 850.0, 850.0, 850.0, 0.039780412125069615, 0.06165186918211473, 0.08946707922269075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f7774b8-fb83-43ba-b866-a45ad228e478", 3, 0, 0.0, 338.6666666666667, 242, 478, 296.0, 478.0, 478.0, 478.0, 0.02887947631882942, 0.02896408415960724, 0.01851971625914517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea7cc202-f98d-46ab-a055-47c18d33b5f5", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["addBook", 55, 10, 18.181818181818183, 1421.8181818181818, 689, 3146, 1075.0, 2527.2, 2828.399999999999, 3146.0, 0.26993600062821466, 89.1553317191365, 0.9795005463136558], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 242.49090909090907, 128, 621, 143.0, 551.0, 586.4, 621.0, 0.2461334669912645, 0.18291754724643777, 0.11898053336003508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6911a02d-32a8-4659-b2c1-0e66812faee3", 2, 0, 0.0, 408.5, 355, 462, 408.5, 462.0, 462.0, 462.0, 0.031084378545561932, 0.03578953350118898, 0.019321491156494307], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 874.8363636363637, 633, 1258, 835.0, 1113.4, 1148.1999999999998, 1258.0, 0.24604427902315945, 72.34518747176082, 0.1237429723602804], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 217.4363636363636, 127, 430, 141.0, 422.4, 424.79999999999995, 430.0, 0.24661907665817698, 0.4364001629927898, 0.11993779314040248], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1297.9454545454544, 879, 1782, 1283.0, 1631.1999999999998, 1694.3999999999999, 1782.0, 0.24546119927879034, 220.86641858581993, 0.12321001604423656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 142.41666666666666, 136, 155, 141.0, 153.20000000000002, 155.0, 155.0, 0.07975276642408534, 0.059580924135180936, 0.028349616189811584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, 6.0606060606060606, 216.5151515151515, 129, 2090, 145.0, 361.0000000000001, 451.9999999999998, 1857.6800000000012, 0.6803702863740387, 1.52861839731563, 0.324722182133064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 166.33333333333337, 129, 472, 145.0, 284.8000000000001, 472.0, 472.0, 0.07485664951617653, 0.057970042056960915, 0.026609199632703372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc2e3df-408a-4964-8f04-f1f209a835f3", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 141.66666666666666, 130, 158, 140.0, 153.8, 158.0, 158.0, 0.08807055038222619, 0.07147131578870113, 0.03130632845618196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f861d7e4-d9f7-4465-bfde-9c36f1c79bb1", 3, 0, 0.0, 305.0, 224, 466, 225.0, 466.0, 466.0, 466.0, 0.042000336002688016, 0.02700216914235314, 0.026933809220473764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 340.19999999999993, 261, 927, 278.0, 703.8000000000002, 927.0, 927.0, 0.07446238160481325, 0.11540214805355335, 0.16746764144129386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 539.5625, 256, 1772, 285.5, 1661.4, 1772.0, 1772.0, 0.12480985997893833, 18.833749975623075, 0.2767085787277195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05ee0932-d84f-401e-95bc-0b73e558b88d", 3, 0, 0.0, 364.6666666666667, 251, 448, 395.0, 448.0, 448.0, 448.0, 0.017467248908296942, 0.024080012736535664, 0.011201328238719069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 201.07142857142858, 130, 405, 144.5, 401.5, 405.0, 405.0, 0.0869592223360974, 0.07209802711264325, 0.03091128606478462], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb8099e9-b629-45c0-a36e-5b380539d6d4", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.2103190483119907, 0.8026229627473807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40044f9f-0316-4ee2-aedd-f57dd9de5b85", 3, 0, 0.0, 307.6666666666667, 238, 447, 238.0, 447.0, 447.0, 447.0, 0.04322828859205464, 0.02779162433896742, 0.027721265796337123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 182.76923076923077, 137, 422, 142.0, 413.59999999999997, 422.0, 422.0, 0.15722129501971316, 0.12206145462956243, 0.05588725721403865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f20fe501-8652-4354-8df8-587eb47e469e", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41d562e1-ae92-4d80-b6c5-14754219073c", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 140.0, 128, 158, 136.5, 156.5, 158.0, 158.0, 0.08539041207989696, 0.06345908553984529, 0.04286198418854203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 226.41666666666669, 125, 422, 137.0, 421.7, 422.0, 422.0, 0.08539527337161888, 0.0335382152743679, 0.04810433612291227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 381.83333333333337, 133, 1591, 269.0, 1273.300000000001, 1591.0, 1591.0, 0.08538555134162049, 6.4236020006012575, 0.04958588007599315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 245.00000000000003, 126, 888, 136.5, 743.1000000000006, 888.0, 888.0, 0.08539466567988385, 2.1135040767057585, 0.049674566266260566], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6235385814497272], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2338269680436477], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.2338269680436477], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.2470771628994544], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
