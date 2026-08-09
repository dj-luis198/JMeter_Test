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

    var data = {"OkPercent": 98.47389558232932, "KoPercent": 1.5261044176706828};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7266758811333794, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc49172d-ef9b-4a4d-a869-960c1d99fd1d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b13206f4-6178-407f-8e9b-df013d35f927"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/343d3b56-d19d-4a01-848d-68aa0c0e0328"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f59bd9b5-513a-48db-aa46-52a27a8a54b2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84ec2b5c-d5be-49cb-b01c-2ff4b2859666"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe09f382-0365-41e7-a616-45086478d567"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bce0169d-87fe-4c72-bbd8-7db1e3a307b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c85f71f4-58b0-4d06-8c24-c22decad8b3f"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2775ba25-7418-47aa-84a2-a4a6a6640d77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3cae0c0-ac91-4acb-89f2-d748b21cea9f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/190a3fc0-2152-4098-a21a-9176f51791de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84ec2b5c-d5be-49cb-b01c-2ff4b2859666"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/831bdc49-e912-4f31-a3d5-005cf348ffa1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b13206f4-6178-407f-8e9b-df013d35f927"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc49172d-ef9b-4a4d-a869-960c1d99fd1d"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e90a2dc-acf6-4758-a8bf-8a7f01b4c18a"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe09f382-0365-41e7-a616-45086478d567"], "isController": false}, {"data": [0.24528301886792453, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f59bd9b5-513a-48db-aa46-52a27a8a54b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=190a3fc0-2152-4098-a21a-9176f51791de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c85f71f4-58b0-4d06-8c24-c22decad8b3f"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bce0169d-87fe-4c72-bbd8-7db1e3a307b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3cae0c0-ac91-4acb-89f2-d748b21cea9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7281f5c8-c775-4c57-ba70-4ab01b00ace9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2775ba25-7418-47aa-84a2-a4a6a6640d77"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=831bdc49-e912-4f31-a3d5-005cf348ffa1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/312bd30a-d3a2-47a3-9872-ff0d54a70ea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1245, 19, 1.5261044176706828, 482.6457831325305, 1, 2835, 160.0, 1376.8000000000002, 1647.1000000000001, 2193.24, 4.909577027122948, 675.4784912095896, 3.5836508004187926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2409.5660377358495, 1857, 3913, 2378.0, 2831.8, 3066.999999999999, 3913.0, 0.24465227065003645, 294.399288698046, 1.202953303440365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc49172d-ef9b-4a4d-a869-960c1d99fd1d", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b13206f4-6178-407f-8e9b-df013d35f927", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 579.3076923076923, 145, 1015, 554.0, 899.3999999999999, 1015.0, 1015.0, 0.07620700166482988, 0.014437654612282224, 0.05151643689767158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 579.3076923076923, 145, 1015, 554.0, 899.3999999999999, 1015.0, 1015.0, 0.07639239836872848, 0.014472778597200512, 0.051641766295086204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 211.57894736842107, 137, 415, 140.0, 415.0, 415.0, 415.0, 0.1286774665438587, 0.04460325012190497, 0.07281758360649077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 170.42105263157893, 137, 419, 141.0, 418.0, 419.0, 419.0, 0.12867398076662603, 0.09562587828457267, 0.06458830675199784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 278.00000000000006, 138, 835, 140.0, 425.0, 835.0, 835.0, 0.1284425996782175, 2.0205019105836706, 0.07505468316928736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/343d3b56-d19d-4a01-848d-68aa0c0e0328", 1, 0, 0.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 0.31094054284323275, 0.5809928797468354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 271.5789473684211, 136, 1554, 140.0, 421.0, 1554.0, 1554.0, 0.12843999486240018, 6.115456200694252, 0.07492773137789074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f59bd9b5-513a-48db-aa46-52a27a8a54b2", 3, 0, 0.0, 395.0, 259, 633, 293.0, 633.0, 633.0, 633.0, 0.06147037128104254, 0.02781374221375297, 0.039419476374887304], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 355.1538461538462, 138, 1525, 256.0, 1086.5999999999995, 1525.0, 1525.0, 0.07632870663942319, 0.17620050743911317, 0.0493395823792245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/84ec2b5c-d5be-49cb-b01c-2ff4b2859666", 3, 0, 0.0, 346.0, 240, 485, 313.0, 485.0, 485.0, 485.0, 0.07405396065266225, 0.03278430549727234, 0.04748903075707832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 169.26315789473682, 138, 416, 140.0, 416.0, 416.0, 416.0, 0.11769661529312651, 0.08746789476373953, 0.05907818384830765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 196.94736842105263, 137, 416, 140.0, 415.0, 416.0, 416.0, 0.11769953167975816, 0.03149382000024779, 0.06712551416111208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 931.75, 689, 1111, 963.5, 1111.0, 1111.0, 1111.0, 0.050598965251160616, 14.877775827609327, 0.028857222369802538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1265.5, 961, 1510, 1295.5, 1510.0, 1510.0, 1510.0, 0.05042546485975418, 45.37292191931925, 0.02870902930980145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 146.0, 138, 167, 139.5, 167.0, 167.0, 167.0, 0.0509528176908183, 0.09016260317945582, 0.028213132451849584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe09f382-0365-41e7-a616-45086478d567", 3, 0, 0.0, 388.3333333333333, 256, 530, 379.0, 530.0, 530.0, 530.0, 0.01679919363870534, 0.023159044615858437, 0.010772920399820808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 162.15384615384616, 139, 417, 141.0, 307.39999999999986, 417.0, 417.0, 0.06708707902857909, 0.0498567061921374, 0.033674568965517244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 159.99999999999997, 137, 412, 139.0, 303.9999999999999, 412.0, 412.0, 0.06708777144744447, 0.017951220094335727, 0.03826099465362067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 225.76923076923077, 138, 427, 140.0, 423.8, 427.0, 427.0, 0.067083270980293, 0.018081037881407098, 0.039437626103648815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 225.6923076923077, 137, 428, 140.0, 424.8, 428.0, 428.0, 0.0670863866240066, 0.01808187764475178, 0.039504971810816386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 213.75, 141, 419, 147.5, 419.0, 419.0, 419.0, 0.05095216865167824, 0.03786582064836635, 0.028610836889370106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 922.7777777777777, 138, 1816, 1239.5, 1669.3000000000002, 1816.0, 1816.0, 0.10721624921821485, 53.6091600090836, 0.05791259642016857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 190.63157894736847, 137, 555, 140.0, 413.0, 555.0, 555.0, 0.1176988025695507, 0.031723505380074214, 0.06919402260436476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 708.8888888888889, 139, 1247, 958.0, 1239.8, 1247.0, 1247.0, 0.10721816513980058, 17.52712191449947, 0.05801833653995068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 168.5263157894737, 137, 413, 140.0, 412.0, 413.0, 413.0, 0.1176988025695507, 0.031723505380074214, 0.0693089628412491], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 472.83333333333337, 142, 750, 509.0, 717.3000000000001, 750.0, 750.0, 0.07971356259839643, 0.015160367496130572, 0.05448520607616631], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bce0169d-87fe-4c72-bbd8-7db1e3a307b5", 3, 0, 0.0, 559.6666666666666, 258, 973, 448.0, 973.0, 973.0, 973.0, 0.03591438011779916, 0.02994034097711057, 0.023031031520854284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c85f71f4-58b0-4d06-8c24-c22decad8b3f", 3, 0, 0.0, 507.0, 233, 873, 415.0, 873.0, 873.0, 873.0, 0.019795316428133106, 0.02728944175558063, 0.012694262162572337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 410.69230769230774, 279, 837, 283.0, 730.1999999999999, 837.0, 837.0, 0.06703346000938469, 0.10388877054188818, 0.15075982265782514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 798.1052631578948, 187, 2356, 698.0, 1595.0, 2356.0, 2356.0, 0.09331015312687235, 0.05731649054375264, 0.04219003993920106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 268.11111111111114, 138, 2114, 141.5, 593.9000000000024, 2114.0, 2114.0, 0.10721624921821485, 0.079679263335021, 0.05381753134586175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 225.38888888888889, 138, 561, 140.5, 433.2000000000002, 561.0, 561.0, 0.10721752649166384, 0.11815334191073544, 0.05614494171536129], "isController": false}, {"data": ["login", 19, 0, 0.0, 3291.3684210526317, 2232, 5303, 3068.0, 5209.0, 5303.0, 5303.0, 0.09065534270105209, 22.958158011665912, 0.16842715216976406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2775ba25-7418-47aa-84a2-a4a6a6640d77", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 144.2105263157895, 140, 153, 143.0, 152.0, 153.0, 153.0, 0.1191932498980584, 0.09649531656786174, 0.04236947554970045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3cae0c0-ac91-4acb-89f2-d748b21cea9f", 3, 0, 0.0, 469.0, 251, 648, 508.0, 648.0, 648.0, 648.0, 0.0196623322147651, 0.027106112281748113, 0.012608982572619547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/190a3fc0-2152-4098-a21a-9176f51791de", 3, 0, 0.0, 1108.0, 542, 1525, 1257.0, 1525.0, 1525.0, 1525.0, 0.02754947426419946, 0.027630185614582855, 0.01766681780614353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84ec2b5c-d5be-49cb-b01c-2ff4b2859666", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/831bdc49-e912-4f31-a3d5-005cf348ffa1", 3, 0, 0.0, 657.3333333333333, 239, 1191, 542.0, 1191.0, 1191.0, 1191.0, 0.040231195268811436, 0.02586478211455162, 0.025799301653502124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1208.2777777777778, 281, 2527, 1456.0, 2016.7000000000007, 2527.0, 2527.0, 0.10712627807601205, 71.27393974742004, 0.225702142079202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b13206f4-6178-407f-8e9b-df013d35f927", 3, 0, 0.0, 801.6666666666666, 231, 1658, 516.0, 1658.0, 1658.0, 1658.0, 0.03724024926140172, 0.031045663528141212, 0.023881279637031703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc49172d-ef9b-4a4d-a869-960c1d99fd1d", 3, 0, 0.0, 352.0, 254, 538, 264.0, 538.0, 538.0, 538.0, 0.03271894426873159, 0.03302781451085179, 0.020981875068164468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 531.0526315789474, 278, 1697, 554.0, 837.0, 1697.0, 1697.0, 0.12831508782830092, 8.267841811977876, 0.2868557126383608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1033.0, 138, 1929, 1175.5, 1929.0, 1929.0, 1929.0, 0.07550303899731964, 60.22532348333271, 0.13017638217750765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e90a2dc-acf6-4758-a8bf-8a7f01b4c18a", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1393.0, 190, 2677, 1324.5, 2190.0, 2610.699999999999, 2677.0, 0.09043375316518136, 0.028453233417738172, 0.04080116597882206], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 404.8421052631578, 277, 972, 283.0, 832.0, 972.0, 972.0, 0.11759536055356468, 0.18224984101416714, 0.26447472202622996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 145.08333333333331, 140, 166, 143.0, 160.60000000000002, 166.0, 166.0, 0.0725983556472446, 0.05636298119097602, 0.025806446733981473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 491.57142857142856, 280, 1666, 378.0, 890.0000000000002, 1596.499999999999, 1666.0, 0.09696365248226951, 5.66703489768026, 0.21689214323147532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 140.25, 138, 143, 140.0, 143.0, 143.0, 143.0, 0.023808248367646972, 0.01769343457790952, 0.011950624668916547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 210.0, 139, 421, 140.0, 421.0, 421.0, 421.0, 0.023808248367646972, 0.024250002976031047, 0.012578381217672864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 1, 25.0, 445.0, 1, 1502, 138.5, 1502.0, 1502.0, 1502.0, 0.023616654464728527, 5.326870180726448, 0.009905618254493067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 550.25, 139, 1092, 485.0, 1092.0, 1092.0, 1092.0, 0.023673962192682377, 3.4836559033983976, 0.012923578970419385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe09f382-0365-41e7-a616-45086478d567", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1620.1320754716978, 1096, 2532, 1503.0, 2193.6, 2297.2, 2532.0, 0.23342876018498127, 279.26195014864567, 0.46093061825589077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1393.0, 190, 2677, 1324.5, 2190.0, 2610.699999999999, 2677.0, 0.08783381841555776, 0.027635214174781313, 0.03962814854295672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 139.8, 139, 141, 139.0, 141.0, 141.0, 141.0, 0.02528266014036933, 0.006814466990958921, 0.014888128969377641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f59bd9b5-513a-48db-aa46-52a27a8a54b2", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 193.8, 137, 412, 140.0, 412.0, 412.0, 412.0, 0.025247807227942252, 0.00680507304190631, 0.014842949171114488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 310.91666666666663, 137, 1367, 140.0, 1082.300000000001, 1367.0, 1367.0, 0.0738606987222099, 5.556580997873428, 0.0428930620183667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 369.16666666666663, 138, 1114, 410.0, 946.0000000000006, 1114.0, 1114.0, 0.07386115334190943, 1.8280515235401649, 0.0429654560618464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 193.8, 139, 410, 140.0, 410.0, 410.0, 410.0, 0.02524806221122529, 0.006755829146363017, 0.014399285479839423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 187.08333333333331, 139, 420, 140.0, 420.0, 420.0, 420.0, 0.07373317193961254, 0.054795843599653456, 0.037010596071250824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 141.0, 138, 144, 141.0, 144.0, 144.0, 144.0, 0.02528176527397849, 0.018788499388181282, 0.012690261084789985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 232.08333333333334, 138, 418, 141.5, 418.0, 418.0, 418.0, 0.07385797112153329, 0.029007044973349584, 0.041605214526631955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=190a3fc0-2152-4098-a21a-9176f51791de", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 146.6, 142, 157, 143.0, 157.0, 157.0, 157.0, 0.0237749934618768, 0.018713520244406933, 0.008451267207151518], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 676.25, 140, 1191, 540.0, 1189.5, 1191.0, 1191.0, 0.07822481812729785, 0.01469898315884853, 0.05323845654285416], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1740.0526315789475, 996, 2835, 1651.0, 2474.0, 2835.0, 2835.0, 0.09131498382763575, 0.04726263811391304, 0.04200132556915668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 337.0, 280, 553, 283.0, 553.0, 553.0, 553.0, 0.025229207348763518, 0.03910034381102315, 0.05674107863691639], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1393.4827586206898, 721, 3031, 1157.5, 2384.6, 2702.3999999999996, 3031.0, 0.2872083349839559, 85.52610326841848, 1.0418797646253417], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c85f71f4-58b0-4d06-8c24-c22decad8b3f", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 246.377358490566, 139, 578, 142.0, 557.0, 564.3, 578.0, 0.23514274939550567, 0.1747496409081834, 0.1136676376472415], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 858.4716981132074, 680, 1269, 823.0, 1108.8, 1153.8999999999996, 1269.0, 0.2350645318667672, 69.1167772458642, 0.11822093155408701], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 196.6037735849056, 137, 568, 141.0, 419.0, 424.2, 568.0, 0.2356299098826741, 0.41695448897207565, 0.11459345226715986], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1372.0188679245284, 954, 1952, 1253.0, 1664.2, 1835.6999999999996, 1952.0, 0.23405448611791932, 210.60263803280515, 0.11748438072715871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 182.1904761904762, 140, 490, 144.0, 398.0000000000001, 483.7999999999999, 490.0, 0.1019199782570713, 0.07614139000650347, 0.03622936727106831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 222.431952662722, 139, 1766, 150.0, 417.0, 453.5, 1045.0000000000118, 0.6949470359892098, 1.4733089193779196, 0.3355026119625469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 144.5, 142, 147, 144.5, 147.0, 147.0, 147.0, 0.024418235538300005, 0.018909824982296777, 0.008679919664005078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bce0169d-87fe-4c72-bbd8-7db1e3a307b5", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 161.0, 140, 429, 144.0, 177.0, 429.0, 429.0, 0.1284122167327877, 0.10420952353998687, 0.045646530166733125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3cae0c0-ac91-4acb-89f2-d748b21cea9f", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7281f5c8-c775-4c57-ba70-4ab01b00ace9", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 1, 25.0, 794.25, 280, 1641, 628.0, 1641.0, 1641.0, 1641.0, 0.023597149464344706, 8.836395063476331, 0.04709060051795743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2775ba25-7418-47aa-84a2-a4a6a6640d77", 3, 0, 0.0, 577.0, 260, 1186, 285.0, 1186.0, 1186.0, 1186.0, 0.01864037131619662, 0.022032287841507136, 0.011953623532847442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 625.5833333333333, 283, 1508, 558.0, 1306.4000000000008, 1508.0, 1508.0, 0.07366708615979618, 7.448942618327757, 0.1641083021271371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=831bdc49-e912-4f31-a3d5-005cf348ffa1", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 145.84615384615387, 138, 153, 145.0, 152.6, 153.0, 153.0, 0.06873906123592832, 0.05699166307549135, 0.024434588173708895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 163.11111111111111, 141, 418, 146.5, 202.90000000000035, 418.0, 418.0, 0.10691756655618517, 0.08300729044156954, 0.03800585373676895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312bd30a-d3a2-47a3-9872-ff0d54a70ea0", 2, 0, 0.0, 346.0, 263, 429, 346.0, 429.0, 429.0, 429.0, 0.010925916820995241, 0.021606427307143912, 0.006791353570862766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 172.52380952380952, 139, 425, 141.0, 376.4000000000001, 423.7, 425.0, 0.0971516073964757, 0.07219958323116993, 0.04876555293143409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 232.7619047619048, 138, 428, 141.0, 417.8, 427.0, 428.0, 0.09702951083265182, 0.03290267824552163, 0.05494909704799265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 264.95238095238096, 137, 1241, 140.0, 530.8000000000001, 1172.799999999999, 1241.0, 0.09715385469484437, 4.187758534792646, 0.05671826133924276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 263.9047619047619, 137, 1094, 141.0, 419.6, 1026.599999999999, 1094.0, 0.09702771758465668, 1.3834481254013944, 0.05673937633124339], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4819277108433735], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.08032128514056225], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 5.2631578947368425, 0.08032128514056225], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.08032128514056225], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.7228915662650602], "isController": false}, {"data": ["Assertion failed", 1, 5.2631578947368425, 0.08032128514056225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1245, 19, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
