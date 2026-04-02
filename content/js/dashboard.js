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

    var data = {"OkPercent": 99.15902140672783, "KoPercent": 0.8409785932721713};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7366863905325444, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88f03fb8-0e31-4a1b-9507-7ea87a4d7151"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbe554ef-c78b-4c94-897b-cb94d4756ce8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f70fb3a-2cac-4b06-b0a0-a68501ab6fad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59a2ec30-3c47-421f-a245-576dac8706eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68eff3f5-426c-431b-9763-7f049cad9c3c"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3c80c21-9d31-4cc0-9366-4d1795fea215"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1bd01aa4-4582-4e78-bb48-33e8a8897df3"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bd01aa4-4582-4e78-bb48-33e8a8897df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f70fb3a-2cac-4b06-b0a0-a68501ab6fad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e83db030-a1ab-4fa5-8655-0c639bf4eb3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6e2b03c-d93e-4676-86c7-6cf0092b0708"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51377599-1b30-44ce-a4e3-a4057d4724b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3259c9f-98ef-4add-9698-8c8251d1d33a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78c644a4-d8ff-412d-a012-84b14d64c729"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d068ce09-1116-49f3-b7be-0215570434ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e02970a-4642-44ce-b264-0584f68f5cc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56c1e856-523c-41da-b5bf-8565e78f56a2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9af31cc-b3f1-4887-944d-d610303c591a"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.21929824561403508, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbe554ef-c78b-4c94-897b-cb94d4756ce8"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd0bdf4b-e715-4b24-862c-73f1f69fec2b"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3c80c21-9d31-4cc0-9366-4d1795fea215"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9450867052023122, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68eff3f5-426c-431b-9763-7f049cad9c3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa6bf56f-3553-4e0c-9cc2-a3dad9cd293c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd0bdf4b-e715-4b24-862c-73f1f69fec2b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78c644a4-d8ff-412d-a012-84b14d64c729"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e02970a-4642-44ce-b264-0584f68f5cc8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51377599-1b30-44ce-a4e3-a4057d4724b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8146029b-fcf9-4ac0-817f-07c4706d2d7f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d068ce09-1116-49f3-b7be-0215570434ed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56c1e856-523c-41da-b5bf-8565e78f56a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9af31cc-b3f1-4887-944d-d610303c591a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3259c9f-98ef-4add-9698-8c8251d1d33a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 11, 0.8409785932721713, 500.94418960244684, 141, 2835, 167.0, 1411.4000000000005, 1732.5999999999995, 2187.9800000000064, 5.1146694820810605, 742.4632370911295, 3.7252192516178857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2466.40350877193, 1919, 3475, 2415.0, 2970.2000000000003, 3427.7, 3475.0, 0.2622522406463368, 315.57742454640714, 1.2894922184124076], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 667.1538461538462, 445, 1804, 506.0, 1440.3999999999996, 1804.0, 1804.0, 0.07507724293263261, 0.013563759709508821, 0.051029063555773725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 667.1538461538462, 445, 1804, 506.0, 1440.3999999999996, 1804.0, 1804.0, 0.07631212834525955, 0.013786859124875992, 0.0518683997346686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 268.9411764705882, 142, 447, 153.0, 445.4, 447.0, 447.0, 0.12629076591635094, 0.056108271116558944, 0.07077738466681524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 149.8235294117647, 143, 158, 150.0, 154.0, 158.0, 158.0, 0.12655495090412344, 0.09405109144339643, 0.06352465309054633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88f03fb8-0e31-4a1b-9507-7ea87a4d7151", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 300.5882352941176, 141, 1168, 149.0, 1140.8, 1168.0, 1168.0, 0.12655495090412344, 4.4079042872350715, 0.07324455022742668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 326.05882352941177, 143, 1973, 149.0, 1464.1999999999996, 1973.0, 1973.0, 0.12656060391742294, 13.427681665649217, 0.07312422760807903], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 392.53846153846155, 231, 2004, 244.0, 1341.9999999999995, 2004.0, 2004.0, 0.07529858786186763, 0.15771863922419288, 0.04867936051226209], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbe554ef-c78b-4c94-897b-cb94d4756ce8", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 174.16666666666669, 145, 442, 150.5, 355.6000000000003, 442.0, 442.0, 0.06468514505643778, 0.0480716751835441, 0.032468910702157246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 172.74999999999997, 145, 445, 148.0, 356.8000000000003, 445.0, 445.0, 0.06468444770262403, 0.025404227263416634, 0.03643764217102568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f70fb3a-2cac-4b06-b0a0-a68501ab6fad", 3, 0, 0.0, 307.0, 237, 428, 256.0, 428.0, 428.0, 428.0, 0.06767273465520743, 0.044300087692585324, 0.043396903408450066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 949.5, 849, 1183, 883.0, 1183.0, 1183.0, 1183.0, 0.03872516748634938, 11.386485037563412, 0.02208544708205863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1683.75, 1595, 1786, 1677.0, 1786.0, 1786.0, 1786.0, 0.038402826448026575, 34.55493074290268, 0.021864109198437003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 288.5, 144, 434, 288.0, 434.0, 434.0, 434.0, 0.03889423684645527, 0.06882456754470406, 0.021536164347597794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 202.0, 147, 451, 151.0, 440.59999999999997, 451.0, 451.0, 0.07826887661141804, 0.058166616309852676, 0.0392873072053407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59a2ec30-3c47-421f-a245-576dac8706eb", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 234.23529411764707, 144, 446, 150.0, 444.4, 446.0, 446.0, 0.07827103879481018, 0.03477413913367773, 0.043865593662808365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 321.7647058823529, 142, 1626, 151.0, 1385.9999999999998, 1626.0, 1626.0, 0.0782699576881817, 8.304196118615819, 0.045222842051225384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 288.47058823529414, 144, 1206, 150.0, 922.7999999999997, 1206.0, 1206.0, 0.0782699576881817, 2.7261397487073946, 0.04529927755678025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 147.25, 143, 149, 148.5, 149.0, 149.0, 149.0, 0.03900270093703989, 0.028985405676843122, 0.02190093070195111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 936.55, 143, 1863, 890.5, 1796.2, 1859.7, 1863.0, 0.10200074460543562, 45.90397084117464, 0.055582437001790115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 329.33333333333337, 145, 1423, 150.5, 1130.800000000001, 1423.0, 1423.0, 0.06457966709181615, 4.858363882543039, 0.03750329625384114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 642.3000000000001, 144, 1333, 663.5, 1202.2, 1326.5, 1333.0, 0.10200126481568372, 15.009625572482099, 0.055682331085905465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68eff3f5-426c-431b-9763-7f049cad9c3c", 3, 0, 0.0, 450.0, 231, 695, 424.0, 695.0, 695.0, 695.0, 0.023646438452261782, 0.023715715127414893, 0.015163894450180895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 333.25, 147, 1182, 151.0, 963.3000000000008, 1182.0, 1182.0, 0.0645810572995431, 1.5983706569238967, 0.037567171026784994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3c80c21-9d31-4cc0-9366-4d1795fea215", 3, 0, 0.0, 453.0, 239, 789, 331.0, 789.0, 789.0, 789.0, 0.01967819590299961, 0.019735846867559182, 0.012619155575816809], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 671.1538461538461, 247, 1419, 573.0, 1289.3999999999999, 1419.0, 1419.0, 0.07605452524425203, 0.013740319502135376, 0.05243603010004095], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1bd01aa4-4582-4e78-bb48-33e8a8897df3", 3, 0, 0.0, 965.6666666666666, 402, 2004, 491.0, 2004.0, 2004.0, 2004.0, 0.10308569857741735, 0.0466435940828809, 0.06610638873616934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 578.7647058823529, 298, 2064, 305.0, 1592.7999999999995, 2064.0, 2064.0, 0.07821486082355647, 11.115446895847711, 0.1735527015757994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 619.8695652173913, 160, 1182, 665.0, 967.2000000000003, 1151.5999999999995, 1182.0, 0.09719035364611724, 0.05969993402676538, 0.04394446654116434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 165.85000000000002, 144, 431, 150.5, 169.00000000000003, 417.9499999999998, 431.0, 0.1019898214158227, 0.0757951700170323, 0.051194109577864126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bd01aa4-4582-4e78-bb48-33e8a8897df3", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 251.05, 144, 450, 149.5, 446.9, 449.85, 450.0, 0.10200126481568372, 0.10389386640894348, 0.053889340102817276], "isController": false}, {"data": ["login", 23, 0, 0.0, 2587.260869565217, 1655, 4430, 2326.0, 3879.0000000000005, 4356.199999999999, 4430.0, 0.10020214693991357, 20.987950623758366, 0.18008051433108532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f70fb3a-2cac-4b06-b0a0-a68501ab6fad", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 153.66666666666666, 145, 178, 152.0, 172.3, 178.0, 178.0, 0.06395122653123218, 0.051773014447647925, 0.02273266255602394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83db030-a1ab-4fa5-8655-0c639bf4eb3f", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6e2b03c-d93e-4676-86c7-6cf0092b0708", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51377599-1b30-44ce-a4e3-a4057d4724b3", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3259c9f-98ef-4add-9698-8c8251d1d33a", 3, 0, 0.0, 340.0, 264, 492, 264.0, 492.0, 492.0, 492.0, 0.018942263979390816, 0.026113440088776075, 0.012147220064908823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78c644a4-d8ff-412d-a012-84b14d64c729", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1104.8, 298, 2021, 1181.5, 1959.5, 2018.0, 2021.0, 0.10191134731896723, 61.03967209705527, 0.21616352185234067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d068ce09-1116-49f3-b7be-0215570434ed", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e02970a-4642-44ce-b264-0584f68f5cc8", 3, 0, 0.0, 490.0, 242, 861, 367.0, 861.0, 861.0, 861.0, 0.036488804018633615, 0.023458785135677538, 0.023399395806220125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56c1e856-523c-41da-b5bf-8565e78f56a2", 3, 0, 0.0, 345.3333333333333, 243, 489, 304.0, 489.0, 489.0, 489.0, 0.03074022460857447, 0.025626860424010165, 0.019712969556930898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 597.0588235294117, 294, 2117, 583.0, 1615.3999999999996, 2117.0, 2117.0, 0.12615112905260503, 17.92787407751987, 0.2799195577846378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1831.25, 1738, 1935, 1826.0, 1935.0, 1935.0, 1935.0, 0.03834796947501629, 45.877503403382285, 0.08647017726348889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9af31cc-b3f1-4887-944d-d610303c591a", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1179.1739130434783, 190, 2461, 1233.0, 1926.0, 2356.3999999999987, 2461.0, 0.10121680198913019, 0.032197532290360195, 0.045666174334939594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 173.18750000000003, 147, 446, 152.5, 259.8000000000002, 446.0, 446.0, 0.07930882360230591, 0.06157276832405585, 0.028191808389882177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 578.0, 297, 1573, 587.0, 1368.4000000000008, 1573.0, 1573.0, 0.0645289654393616, 6.524929732325785, 0.1437512939401924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 547.7647058823529, 293, 1562, 591.0, 1025.1999999999996, 1562.0, 1562.0, 0.10311154242736702, 7.406711537878328, 0.23034839001940924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 148.33333333333334, 144, 152, 149.0, 152.0, 152.0, 152.0, 0.07189474609172171, 0.05342959157792991, 0.03608779247182125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 181.66666666666666, 145, 445, 149.0, 445.0, 445.0, 445.0, 0.07189704343380279, 0.019238076075060513, 0.041003782583340656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 244.77777777777777, 142, 447, 150.0, 447.0, 447.0, 447.0, 0.07189646908451829, 0.01937834518293657, 0.04226726014539064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 211.0, 143, 445, 148.0, 445.0, 445.0, 445.0, 0.07189704343380279, 0.019378499988017158, 0.04233780975642879], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1706.4210526315792, 1147, 2835, 1578.0, 2364.2000000000003, 2814.1, 2835.0, 0.25650718220110164, 306.87176623757966, 0.5065014867291284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1179.1739130434783, 190, 2461, 1233.0, 1926.0, 2356.3999999999987, 2461.0, 0.10080159178861468, 0.03206545200748562, 0.04547884317025389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 148.85714285714286, 145, 151, 150.0, 151.0, 151.0, 151.0, 0.03856536829926726, 0.010394571924411879, 0.02270987996529117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 147.7142857142857, 144, 152, 147.0, 152.0, 152.0, 152.0, 0.03856579324327302, 0.010394686460100932, 0.022672468293408552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 370.0625, 142, 1631, 150.5, 1613.5, 1631.0, 1631.0, 0.08045214103260323, 9.067846060484925, 0.04643282749049659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 300.875, 147, 1299, 149.5, 992.4000000000003, 1299.0, 1299.0, 0.08045335465347232, 2.9759688029546494, 0.04651209565903869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 174.3125, 145, 526, 150.0, 270.5000000000002, 526.0, 526.0, 0.08045173650045002, 0.05978883933285397, 0.040383000548077454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 146.2857142857143, 142, 151, 146.0, 151.0, 151.0, 151.0, 0.03856515583077609, 0.010319192087531886, 0.02199419043473949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 222.0, 143, 454, 149.5, 445.6, 454.0, 454.0, 0.08045254556882464, 0.03663183532369579, 0.045038497800125706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 148.71428571428572, 144, 155, 148.0, 155.0, 155.0, 155.0, 0.03856621819664364, 0.02866102739027911, 0.01935843374323714], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 640.8461538461539, 428, 947, 695.0, 912.5999999999999, 947.0, 947.0, 0.07589335232613126, 0.013711201347982696, 0.05165787751104832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 201.0, 148, 486, 155.0, 486.0, 486.0, 486.0, 0.04030168691346652, 0.03172183559790431, 0.014325990270021302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1386.5217391304348, 1014, 1972, 1311.0, 1907.4000000000003, 1971.8, 1972.0, 0.09885840038511795, 0.05116694551182862, 0.04547100252088921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 299.42857142857144, 292, 305, 300.0, 305.0, 305.0, 305.0, 0.03853437266041309, 0.05972075137898005, 0.08666470726262826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbe554ef-c78b-4c94-897b-cb94d4756ce8", 3, 0, 0.0, 356.6666666666667, 253, 437, 380.0, 437.0, 437.0, 437.0, 0.04734773756727324, 0.03044003310395985, 0.030362969729013117], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1523.4827586206902, 756, 2996, 1177.0, 2630.1, 2672.35, 2996.0, 0.2508617967759934, 94.12869183142087, 0.9084320989022634], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd0bdf4b-e715-4b24-862c-73f1f69fec2b", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.16963761737089203, 0.6473738262910799], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 259.6491228070176, 145, 612, 152.0, 595.0, 599.0, 612.0, 0.25807736887858596, 0.19179382589512098, 0.12475419687001955], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 927.1578947368422, 707, 1307, 875.0, 1190.4, 1292.5, 1307.0, 0.25795240099379557, 75.84657071799015, 0.1297319204216843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3c80c21-9d31-4cc0-9366-4d1795fea215", 1, 0, 0.0, 1419.0, 1419, 1419, 1419.0, 1419.0, 1419.0, 1419.0, 0.7047216349541932, 0.1273178735024665, 0.48587253347427767], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 227.78947368421052, 143, 596, 152.0, 449.8, 476.5999999999993, 596.0, 0.25864416008712227, 0.45767892390416554, 0.12578592941737], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1445.035087719298, 998, 2227, 1411.0, 1858.8000000000002, 2206.8, 2227.0, 0.25723878980431797, 231.46391524348553, 0.12912181441349554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 171.1764705882353, 145, 461, 152.0, 223.3999999999998, 461.0, 461.0, 0.09980098509442935, 0.07455835312230318, 0.03547613142028543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, 4.046242774566474, 224.26011560693647, 144, 1228, 156.0, 383.5999999999999, 451.59999999999997, 1171.0199999999993, 0.7298962112901864, 1.6277882008902202, 0.34949335103577756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 220.88888888888889, 149, 468, 152.0, 468.0, 468.0, 468.0, 0.07561246093356185, 0.05855535304718217, 0.026877866972477064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68eff3f5-426c-431b-9763-7f049cad9c3c", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa6bf56f-3553-4e0c-9cc2-a3dad9cd293c", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 154.5294117647059, 148, 176, 153.0, 161.6, 176.0, 176.0, 0.11938202247191011, 0.09688130925210674, 0.04243657830056179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd0bdf4b-e715-4b24-862c-73f1f69fec2b", 3, 0, 0.0, 408.0, 244, 736, 244.0, 736.0, 736.0, 736.0, 0.04014720642355303, 0.032632673971227835, 0.02574544161927066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c644a4-d8ff-412d-a012-84b14d64c729", 3, 0, 0.0, 460.66666666666663, 257, 802, 323.0, 802.0, 802.0, 802.0, 0.02700926417761292, 0.027088392881258274, 0.017320394020148913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e02970a-4642-44ce-b264-0584f68f5cc8", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 396.0, 293, 596, 301.0, 596.0, 596.0, 596.0, 0.07180870161888729, 0.11128946237224036, 0.1614994529573217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 582.1875, 294, 1793, 302.5, 1767.8, 1793.0, 1793.0, 0.0803906987961493, 12.130919157731576, 0.17822947650581827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51377599-1b30-44ce-a4e3-a4057d4724b3", 3, 0, 0.0, 360.3333333333333, 243, 456, 382.0, 456.0, 456.0, 456.0, 0.021270109115659762, 0.02514054889289082, 0.013640011379508377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8146029b-fcf9-4ac0-817f-07c4706d2d7f", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d068ce09-1116-49f3-b7be-0215570434ed", 3, 0, 0.0, 550.0, 349, 947, 354.0, 947.0, 947.0, 947.0, 0.07435865658693766, 0.033645355682240675, 0.047684424959722395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56c1e856-523c-41da-b5bf-8565e78f56a2", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 171.76470588235293, 146, 442, 154.0, 221.9999999999998, 442.0, 442.0, 0.08154807018890371, 0.06761163241247974, 0.028987790574961862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9af31cc-b3f1-4887-944d-d610303c591a", 3, 0, 0.0, 495.6666666666667, 297, 708, 482.0, 708.0, 708.0, 708.0, 0.020425670983291802, 0.024142451608181164, 0.013098493436551058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 155.45, 147, 174, 153.0, 172.5, 173.95, 174.0, 0.10021345465842244, 0.0778024379428182, 0.0356227514606111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3259c9f-98ef-4add-9698-8c8251d1d33a", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 167.11764705882354, 145, 444, 150.0, 212.79999999999978, 444.0, 444.0, 0.10320669265046929, 0.07669950498731165, 0.051804921896817596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 286.82352941176464, 142, 448, 151.0, 448.0, 448.0, 448.0, 0.10320418644746908, 0.03673329154575588, 0.05834878234237078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 291.11764705882354, 144, 1416, 150.0, 643.9999999999993, 1416.0, 1416.0, 0.10320355991573733, 5.4886947045191015, 0.060150696168719604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 294.52941176470586, 144, 1196, 150.0, 596.7999999999995, 1196.0, 1196.0, 0.10320606608830796, 1.811240373757733, 0.060252944028921986], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.3058103975535168], "isController": false}, {"data": ["401/Unauthorized", 7, 63.63636363636363, 0.5351681957186545], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 11, "401/Unauthorized", 7, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
