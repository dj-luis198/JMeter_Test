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

    var data = {"OkPercent": 97.78287461773701, "KoPercent": 2.217125382262997};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8144736842105263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14493fa6-bf60-476d-a623-aeee1050b2fc"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c00a52a-0468-43b4-a31d-23a2c189e9d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1d7753-59bd-4e7a-84bb-736e1d2ab1b1"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e62a57a-2b83-447e-a92e-43c0645b54c7"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/98753199-2302-4c6d-b0eb-155e2a5ba9c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=763efff5-25a4-499b-9757-f55bb3e50aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7210c7c4-1fb0-44b9-8951-895b3a2ccb02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2d5ab2f-14c4-491b-865b-0a3414268b97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1751900-e650-43ad-9bb9-c2d65df8add5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1bb8083-0255-4a34-be38-bb1bad894501"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98753199-2302-4c6d-b0eb-155e2a5ba9c9"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3137612e-f832-4c52-85ae-7d7e58b280e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a464d5fa-39c1-4de1-a8d3-84ec4b101c60"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/40569995-92c6-4577-a015-acbc8b799299"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7210c7c4-1fb0-44b9-8951-895b3a2ccb02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e62a57a-2b83-447e-a92e-43c0645b54c7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f2d5ab2f-14c4-491b-865b-0a3414268b97"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c00a52a-0468-43b4-a31d-23a2c189e9d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d1d7753-59bd-4e7a-84bb-736e1d2ab1b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.34375, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e3636d6-9d82-474a-a3b1-fab5e91b405e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8148148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/763efff5-25a4-499b-9757-f55bb3e50aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9175824175824175, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1751900-e650-43ad-9bb9-c2d65df8add5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e3636d6-9d82-474a-a3b1-fab5e91b405e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a464d5fa-39c1-4de1-a8d3-84ec4b101c60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3137612e-f832-4c52-85ae-7d7e58b280e0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/12643b7b-ce3b-4cab-8bb2-c0c02de0ec8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 29, 2.217125382262997, 292.86085626911296, 1, 1797, 91.0, 878.1000000000001, 1050.55, 1343.2000000000016, 5.065703098676643, 679.7370945658425, 3.6987984991208607], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/14493fa6-bf60-476d-a623-aeee1050b2fc", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["see books", 54, 1, 1.8518518518518519, 1408.4259259259259, 1030, 1984, 1378.0, 1715.5, 1805.25, 1984.0, 0.24735128004287424, 297.65438735038686, 1.213526958712949], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c00a52a-0468-43b4-a31d-23a2c189e9d4", 3, 0, 0.0, 314.6666666666667, 189, 408, 347.0, 408.0, 408.0, 408.0, 0.03713330857779428, 0.03018290088501052, 0.023812701138754794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1d7753-59bd-4e7a-84bb-736e1d2ab1b1", 1, 0, 0.0, 1305.0, 1305, 1305, 1305.0, 1305.0, 1305.0, 1305.0, 0.7662835249042146, 0.13843989463601533, 0.5283165708812261], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 412.1538461538462, 87, 836, 422.0, 712.3999999999999, 836.0, 836.0, 0.08016971311576507, 0.015893019299316708, 0.053900160185253704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 412.1538461538462, 87, 836, 422.0, 712.3999999999999, 836.0, 836.0, 0.08156402148270843, 0.016169430040029114, 0.054837589563569746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 106.26666666666667, 81, 247, 84.0, 246.4, 247.0, 247.0, 0.11970122574055159, 0.0799722642284857, 0.06558629660367722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 84.19999999999999, 82, 87, 84.0, 86.4, 87.0, 87.0, 0.11970122574055159, 0.08895764920757789, 0.06008440432680031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 297.46666666666664, 81, 674, 91.0, 666.8, 674.0, 674.0, 0.11970218097373733, 11.753647549895858, 0.06705971792181054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 295.06666666666666, 81, 975, 85.0, 941.4, 975.0, 975.0, 0.11970409148584699, 28.746314111516334, 0.06762969439545444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e62a57a-2b83-447e-a92e-43c0645b54c7", 3, 0, 0.0, 376.33333333333337, 179, 674, 276.0, 674.0, 674.0, 674.0, 0.040748135772788394, 0.03397004417777053, 0.02613080321366964], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 231.61538461538464, 84, 396, 256.0, 364.0, 396.0, 396.0, 0.08008229996365496, 0.1445415731089797, 0.05175992404501857], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 95.2, 81, 246, 84.0, 155.40000000000006, 246.0, 246.0, 0.08578193089407647, 0.06375004825233613, 0.04305850828081573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98753199-2302-4c6d-b0eb-155e2a5ba9c9", 3, 0, 0.0, 613.6666666666666, 396, 889, 556.0, 889.0, 889.0, 889.0, 0.03339455668725998, 0.02783966786330495, 0.021415129125619194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 93.73333333333333, 81, 246, 83.0, 149.40000000000006, 246.0, 246.0, 0.08578781812982555, 0.022954943523019734, 0.04892586502716614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 622.25, 499, 668, 661.0, 668.0, 668.0, 668.0, 0.09841308894082913, 28.9367157706975, 0.05612621478656661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 854.5, 799, 909, 855.0, 909.0, 909.0, 909.0, 0.09803681282321511, 88.213696508664, 0.0558158807382172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=763efff5-25a4-499b-9757-f55bb3e50aee", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 209.5, 84, 254, 250.0, 254.0, 254.0, 254.0, 0.09983776363409459, 0.17666604268064395, 0.05528126169973793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7210c7c4-1fb0-44b9-8951-895b3a2ccb02", 3, 0, 0.0, 269.3333333333333, 176, 442, 190.0, 442.0, 442.0, 442.0, 0.017657549485282434, 0.024342357444717154, 0.011323363439455206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 102.2105263157895, 82, 255, 85.0, 247.0, 255.0, 255.0, 0.09543422572705812, 0.07092328689286252, 0.04790350783565222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 143.89473684210526, 81, 252, 84.0, 248.0, 252.0, 252.0, 0.09535615523982073, 0.02551522122628016, 0.05438280728521026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2d5ab2f-14c4-491b-865b-0a3414268b97", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 114.3157894736842, 82, 331, 84.0, 251.0, 331.0, 331.0, 0.09543518444105119, 0.025722764556377082, 0.056105450228039866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1751900-e650-43ad-9bb9-c2d65df8add5", 3, 0, 0.0, 361.0, 291, 408, 384.0, 408.0, 408.0, 408.0, 0.03768418143677222, 0.024227297635945687, 0.024165962705221773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 118.57894736842105, 81, 253, 84.0, 251.0, 253.0, 253.0, 0.09535615523982073, 0.025701463716982932, 0.05615211094688662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 124.75, 84, 244, 85.5, 244.0, 244.0, 244.0, 0.0998302885095338, 0.07419028276929221, 0.05605704677049017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 630.5555555555555, 83, 1225, 962.5, 1179.1000000000001, 1225.0, 1225.0, 0.12370538874418413, 61.853889009635274, 0.06681916505735119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 110.26666666666667, 81, 334, 83.0, 278.8, 334.0, 334.0, 0.08578830876928092, 0.02312263009797025, 0.05043414246006554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 399.11111111111103, 81, 737, 566.0, 716.3000000000001, 737.0, 737.0, 0.12370708910346723, 20.222592221916774, 0.06694089120648775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 128.20000000000002, 81, 263, 84.0, 257.0, 263.0, 263.0, 0.0857873274959823, 0.02312236561415148, 0.05051734226570051], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 619.7692307692307, 86, 1305, 583.0, 1277.8, 1305.0, 1305.0, 0.08173581726386209, 0.016203487211488284, 0.055456573131550654], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 261.0, 167, 502, 172.0, 498.0, 502.0, 502.0, 0.09531501612830405, 0.14771965878478371, 0.2143657052182463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1bb8083-0255-4a34-be38-bb1bad894501", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98753199-2302-4c6d-b0eb-155e2a5ba9c9", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 431.47368421052636, 120, 967, 416.0, 830.0, 967.0, 967.0, 0.11412028277804806, 0.07009927526112522, 0.05159930754515259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 95.8888888888889, 83, 245, 85.0, 125.30000000000018, 245.0, 245.0, 0.12369603760359543, 0.09192644982064074, 0.062089612625242235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3137612e-f832-4c52-85ae-7d7e58b280e0", 3, 0, 0.0, 271.6666666666667, 188, 408, 219.0, 408.0, 408.0, 408.0, 0.04783010745830809, 0.03075015046554638, 0.030672301983355122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 101.94444444444446, 81, 251, 84.0, 245.60000000000002, 251.0, 251.0, 0.12370538874418413, 0.1363229088634911, 0.06477888520827177], "isController": false}, {"data": ["login", 19, 0, 0.0, 2243.0526315789475, 1518, 3558, 2334.0, 3004.0, 3558.0, 3558.0, 0.11098584638390588, 28.106789102796256, 0.2061988789699345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 97.66666666666667, 84, 245, 86.0, 153.80000000000007, 245.0, 245.0, 0.08753501400560224, 0.07086574864320727, 0.03111596200980392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a464d5fa-39c1-4de1-a8d3-84ec4b101c60", 3, 0, 0.0, 375.0, 189, 680, 256.0, 680.0, 680.0, 680.0, 0.05612092187967674, 0.03608034528397186, 0.03598900263768333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 727.8333333333333, 169, 1314, 1047.0, 1263.6000000000001, 1314.0, 1314.0, 0.12362382643214768, 82.25019402072759, 0.2604604858759778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40569995-92c6-4577-a015-acbc8b799299", 1, 0, 0.0, 1319.0, 1319, 1319, 1319.0, 1319.0, 1319.0, 1319.0, 0.7581501137225171, 0.2421045773313116, 0.45237277293404093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 451.6666666666667, 168, 1057, 329.0, 1025.8, 1057.0, 1057.0, 0.1196200866049427, 40.64054282349259, 0.26018147613180537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 553.25, 84, 1043, 579.5, 1043.0, 1043.0, 1043.0, 0.08132478067723212, 48.65723574529079, 0.11863172962560105], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 836.7391304347826, 164, 1623, 926.0, 1387.0000000000002, 1591.3999999999996, 1623.0, 0.09292328576738473, 0.02927525392297872, 0.041924373070831786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7210c7c4-1fb0-44b9-8951-895b3a2ccb02", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 99.06666666666668, 84, 256, 87.0, 163.00000000000006, 256.0, 256.0, 0.08050535897339567, 0.06250171912485307, 0.028617139322574238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 252.06666666666666, 166, 490, 170.0, 448.0, 490.0, 490.0, 0.08574074285779612, 0.13288140519074457, 0.1928329402358442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e62a57a-2b83-447e-a92e-43c0645b54c7", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d5ab2f-14c4-491b-865b-0a3414268b97", 3, 0, 0.0, 645.3333333333334, 316, 845, 775.0, 845.0, 845.0, 845.0, 0.025087597528035393, 0.03458527849323889, 0.016088075237704984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 282.50000000000006, 168, 1068, 170.0, 630.6000000000007, 1068.0, 1068.0, 0.10644714899052621, 7.230684785967308, 0.2378890495452341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c00a52a-0468-43b4-a31d-23a2c189e9d4", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 85.46153846153845, 83, 92, 84.0, 90.0, 92.0, 92.0, 0.06266449429753101, 0.04657000015666123, 0.031454638739190376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 121.3076923076923, 81, 247, 85.0, 246.6, 247.0, 247.0, 0.062615598027127, 0.01675456431585234, 0.03571045824984587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 109.07692307692307, 81, 248, 84.0, 246.0, 248.0, 248.0, 0.06266479636351366, 0.01689012089485329, 0.036840046299643776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 109.61538461538461, 81, 248, 85.0, 247.6, 248.0, 248.0, 0.062615598027127, 0.016876860405749074, 0.036872271103864825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.5, 86, 87, 86.5, 87.0, 87.0, 87.0, 0.21486892995272883, 0.06336954770090245, 0.1328242506446068], "isController": false}, {"data": ["https://demoqa.com/books", 54, 1, 1.8518518518518519, 970.3888888888888, 648, 1429, 908.0, 1290.5, 1394.5, 1429.0, 0.24878716258241074, 296.2899479404224, 0.48894038120873706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 836.7391304347826, 164, 1623, 926.0, 1387.0000000000002, 1591.3999999999996, 1623.0, 0.09116384521171812, 0.02872094647889557, 0.04113056297638064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d1d7753-59bd-4e7a-84bb-736e1d2ab1b1", 3, 0, 0.0, 651.6666666666667, 269, 1394, 292.0, 1394.0, 1394.0, 1394.0, 0.032054021711257374, 0.02672211901124028, 0.020555476162492523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 83.4, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.033606441682741746, 0.009057986234801486, 0.0197897307955989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 116.4, 82, 247, 84.0, 247.0, 247.0, 247.0, 0.03356898762647116, 0.009047891196197306, 0.019734893116343397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 94.53333333333333, 82, 246, 83.0, 151.80000000000007, 246.0, 246.0, 0.08118420696560497, 0.021881680783698215, 0.04772743417313886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 116.13333333333334, 82, 250, 84.0, 247.6, 250.0, 250.0, 0.08118464635968047, 0.021881799214132622, 0.047806974370007145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.99999999999999, 81, 89, 85.0, 87.8, 89.0, 89.0, 0.08118508575851226, 0.06033383814670686, 0.040751107499878224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 84.2, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.033605989931645416, 0.00899222777467856, 0.01916591613289153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 127.26666666666668, 81, 251, 83.0, 249.8, 251.0, 251.0, 0.08111264924727461, 0.0217039705993684, 0.04625955777383631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 84.2, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.03360576406065168, 0.024974596142730402, 0.016868518288256803], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 588.0769230769231, 84, 1394, 442.0, 1301.1999999999998, 1394.0, 1394.0, 0.08325008325008325, 0.016153467926304465, 0.056652832343938114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 120.8, 84, 262, 86.0, 262.0, 262.0, 262.0, 0.036466272344708374, 0.028702944833823196, 0.012962620247533056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1278.578947368421, 948, 1797, 1211.0, 1745.0, 1797.0, 1797.0, 0.10963773384574547, 0.056746092713129984, 0.05042907484506457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 202.0, 168, 332, 170.0, 332.0, 332.0, 332.0, 0.03355006676463286, 0.05199605073776597, 0.0754548864833491], "isController": false}, {"data": ["addBook", 64, 13, 20.3125, 852.78125, 422, 2233, 707.0, 1570.5, 1777.5, 2233.0, 0.2998894157779319, 85.21714032745346, 1.0919450625433433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e3636d6-9d82-474a-a3b1-fab5e91b405e", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 148.38888888888886, 82, 346, 87.0, 339.5, 342.0, 346.0, 0.24955634427684115, 0.18546130663542593, 0.1206351468916371], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 1, 1.8518518518518519, 515.3518518518517, 1, 747, 491.0, 704.5, 745.25, 747.0, 0.24943645837182662, 71.99309708419173, 0.12312587042930787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/763efff5-25a4-499b-9757-f55bb3e50aee", 3, 0, 0.0, 565.6666666666667, 243, 1162, 292.0, 1162.0, 1162.0, 1162.0, 0.02853989877849233, 0.023792539313710566, 0.018301953318238896], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 131.11111111111114, 82, 259, 86.5, 248.5, 252.5, 259.0, 0.24989818962644847, 0.4422026558624264, 0.12153251800192515], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 820.4814814814815, 562, 1241, 815.5, 1040.5, 1064.25, 1241.0, 0.24922233401331034, 224.25069423131063, 0.1250979293777749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 90.44444444444446, 84, 113, 88.0, 106.70000000000002, 113.0, 113.0, 0.10467063639746929, 0.07819632504303127, 0.037207140281912916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, 7.142857142857143, 138.46703296703288, 83, 1009, 89.0, 257.0, 289.85, 654.5899999999947, 0.7481983630077573, 1.5038478772954684, 0.36353669280907375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 133.6153846153846, 84, 358, 89.0, 315.19999999999993, 358.0, 358.0, 0.0623064904191789, 0.04825102236563366, 0.0221480102661925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1751900-e650-43ad-9bb9-c2d65df8add5", 1, 0, 0.0, 1237.0, 1237, 1237, 1237.0, 1237.0, 1237.0, 1237.0, 0.8084074373484236, 0.14605017178658042, 0.5573590339531124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.73333333333333, 84, 98, 87.0, 96.2, 98.0, 98.0, 0.11032818958796099, 0.08953391166757381, 0.03921822364259551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e3636d6-9d82-474a-a3b1-fab5e91b405e", 3, 0, 0.0, 263.0, 193, 400, 196.0, 400.0, 400.0, 400.0, 0.04633562437253842, 0.029789341841068805, 0.02971392578577496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 221.3846153846154, 168, 336, 174.0, 334.0, 336.0, 336.0, 0.06258997308631156, 0.09700223367966453, 0.14076631642360896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 246.73333333333332, 169, 338, 174.0, 338.0, 338.0, 338.0, 0.08107582210883618, 0.12565168914719047, 0.18234142413735324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a464d5fa-39c1-4de1-a8d3-84ec4b101c60", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 98.21052631578947, 84, 248, 87.0, 110.0, 248.0, 248.0, 0.0968868718288672, 0.08032905681905102, 0.03444025522041764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 90.22222222222223, 83, 112, 87.5, 101.20000000000002, 112.0, 112.0, 0.13018761481824362, 0.10107339236377312, 0.04627762870492254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3137612e-f832-4c52-85ae-7d7e58b280e0", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12643b7b-ce3b-4cab-8bb2-c0c02de0ec8b", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.5795570553539019, 1.0829032441016333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 97.44444444444446, 83, 248, 84.0, 163.40000000000015, 248.0, 248.0, 0.10650068337938502, 0.07914748051925, 0.05345835083691787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 101.33333333333334, 81, 248, 83.5, 243.5, 248.0, 248.0, 0.10654607229742928, 0.037399798598327226, 0.060267434340982945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 156.16666666666663, 81, 980, 83.5, 398.60000000000093, 980.0, 980.0, 0.10654481097174788, 5.3531888806431756, 0.062128018029749675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 142.55555555555554, 82, 653, 84.5, 290.3000000000006, 653.0, 653.0, 0.10654670297146915, 1.7675815933171541, 0.06223317080028413], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.689655172413794, 0.45871559633027525], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.4482758620689653, 0.0764525993883792], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.1529051987767584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1529051987767584], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2996941896024465], "isController": false}, {"data": ["Assertion failed", 1, 3.4482758620689653, 0.0764525993883792], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 29, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 54, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
